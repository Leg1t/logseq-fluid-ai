import '@logseq/libs';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  CustomListOutputParser,
  StructuredOutputParser,
} from 'langchain/output_parsers';
import * as presetPrompts from './prompts';
import { IPrompt, PromptOutputType, ContextType, OutputMode } from './prompts/type';
import settings, { ISettings } from './settings';
import {
  getBlockContent,
  getPageContent,
  getSectionAbove,
  getPdfContent,
  getPagePdfPath,
  getOrCreateAiChatPage,
  createNewAiChatPage,
  sanitizeForLogseq,
} from './utils';

// ─── streaming helper ─────────────────────────────────────────────────────────

/**
 * Pipe a LangChain stream into an existing Logseq block, throttling
 * intermediate writes to ~8 fps so the IPC channel isn't overwhelmed.
 * Returns the final accumulated text (without the tag).
 */
async function streamIntoBlock(
  blockUuid: string,
  modelStream: AsyncIterable<{ content: unknown }>,
  tag: string,
): Promise<string> {
  let buffer = '';
  let scheduled = false;
  let done = false;

  const flush = async () => {
    if (done) return;
    await logseq.Editor.updateBlock(blockUuid, buffer || '…');
    scheduled = false;
  };

  for await (const chunk of modelStream) {
    buffer += chunk.content?.toString() ?? '';
    if (!scheduled) {
      scheduled = true;
      setTimeout(flush, 120); // ~8 fps
    }
  }

  done = true;
  await logseq.Editor.updateBlock(blockUuid, `${buffer}${tag}`);
  return buffer;
}

// ─── context helper ───────────────────────────────────────────────────────────

async function gatherContext(
  block: NonNullable<Awaited<ReturnType<typeof logseq.Editor.getBlock>>>,
  contextType: ContextType,
): Promise<string> {
  switch (contextType) {
    case ContextType.page: {
      const page = await logseq.Editor.getPage(block.page.id);
      if (page) return await getPageContent(page.name);
      break;
    }
    case ContextType.sectionAbove: {
      const above = await getSectionAbove(block.uuid);
      if (above) return above;
      break;
    }
  }
  return await getBlockContent(block);
}

// ─── side-page output ─────────────────────────────────────────────────────────

async function handleSidePageOutput(params: {
  sourcePageName: string;
  question: string;
  sourceBlockUuid: string;
  tag: string;
  response?: string;
  modelStream?: AsyncIterable<{ content: unknown }>;
}): Promise<void> {
  const { sourcePageName, question, sourceBlockUuid, tag, response, modelStream } = params;

  const aiPageName = await getOrCreateAiChatPage(sourcePageName);
  const aiPage = await logseq.Editor.getPage(aiPageName);
  if (!aiPage) return;

  await new Promise((resolve) => setTimeout(resolve, 300));
  await logseq.App.openInRightSidebar(aiPage.uuid);

  const pageBlocks = await logseq.Editor.getPageBlocksTree(aiPageName);
  const anchorUuid = pageBlocks?.length
    ? pageBlocks[pageBlocks.length - 1].uuid
    : aiPage.uuid;

  const qBlock = await logseq.Editor.insertBlock(
    anchorUuid,
    `**Q:** ${question}`,
    { before: false, sibling: true },
  );
  if (!qBlock) return;

  if (modelStream) {
    const aBlock = await logseq.Editor.insertBlock(qBlock.uuid, '**A:** …', {
      before: false,
      sibling: false,
    });
    if (aBlock) {
      const finalText = await streamIntoBlock(aBlock.uuid, modelStream, tag);
      await logseq.Editor.updateBlock(aBlock.uuid, `**A:** ${finalText}${tag}`);
    }
  } else if (response !== undefined) {
    const sanitized = sanitizeForLogseq(response, false);
    const lines = sanitized.split('\n').filter((l) => l.trim());
    if (lines.length <= 1) {
      await logseq.Editor.insertBlock(qBlock.uuid, `**A:** ${sanitized}${tag}`, {
        before: false,
        sibling: false,
      });
    } else {
      const aHeader = await logseq.Editor.insertBlock(qBlock.uuid, `**A:**${tag}`, {
        before: false,
        sibling: false,
      });
      if (aHeader) {
        for (const line of lines) {
          await logseq.Editor.insertBlock(aHeader.uuid, line, {
            before: false,
            sibling: false,
          });
        }
      }
    }
  }

  await logseq.Editor.insertBlock(sourceBlockUuid, `[[${aiPageName}]]${tag}`, {
    before: false,
    sibling: true,
  });
}

// ─── prompt registration ──────────────────────────────────────────────────────

function getPrompts(): IPrompt[] {
  const { customPrompts } = logseq.settings as unknown as ISettings;
  const prompts = [...Object.values(presetPrompts)] as IPrompt[];
  if (customPrompts.enable) prompts.push(...customPrompts.prompts);
  return prompts;
}

function main() {
  const {
    apiKey,
    basePath,
    model: globalModelName,
    tag: tagName,
    streaming: globalStreaming,
    autoPdf: globalAutoPdf,
  } = logseq.settings as unknown as ISettings;

  const tag = tagName ? ` #${tagName}` : '';

  for (const promptDef of getPrompts()) {
    const {
      name,
      system,
      prompt,
      output,
      format,
      model: promptModelName,
      context: contextType   = ContextType.block,
      outputMode             = OutputMode.inline,
      usePdf                 = false,
      pdfPageRange,
      multiBlock             = false,
      streaming: promptStreaming,
      sibling                = false,
      skipModel              = false,
      newChat                = false,
      includeSourcePage      = false,
    } = promptDef;

    const modelName = promptModelName || globalModelName;

    logseq.Editor.registerSlashCommand(name, async ({ uuid }: { uuid: string }) => {
      const block = await logseq.Editor.getBlock(uuid, { includeChildren: true });
      if (!block) return;

      // ── 1. context ──────────────────────────────────────────────────────────
      let content = await gatherContext(block, contextType);

      // ── 2. PDF context ───────────────────────────────────────────────────────
      const currentPage = await logseq.Editor.getPage(block.page.id);
      const pdfPath = currentPage ? await getPagePdfPath(currentPage.name) : null;
      const shouldUsePdf = usePdf || (globalAutoPdf && !!pdfPath);

      if (shouldUsePdf && pdfPath) {
        let dynamicPageRange = pdfPageRange;

        const blocksTree = await logseq.Editor.getPageBlocksTree(currentPage!.name);
        if (blocksTree && blocksTree.length > 0) {
          const flatBlocks: any[] = [];
          const flatten = (nodes: any[]) => {
            for (const n of nodes) {
              flatBlocks.push(n);
              if (n.children?.length) flatten(n.children);
            }
          };
          flatten(blocksTree);

          const blockIndex = flatBlocks.findIndex(b => b.uuid === block.uuid);
          if (blockIndex !== -1 && !dynamicPageRange) {
            for (let i = blockIndex - 1; i >= 0; i--) {
              const rangeProp =
                flatBlocks[i]?.properties?.pdfPageRange ??
                flatBlocks[i]?.properties?.['pdf-page-range'];
              if (rangeProp) {
                const match = rangeProp.match(/(\d+)[\s-,]+(\d+)/);
                if (match) {
                  dynamicPageRange = [parseInt(match[1], 10), parseInt(match[2], 10)];
                  break;
                }
              }
            }
          }
        }

        const pdfText = await getPdfContent(pdfPath, dynamicPageRange);
        if (pdfText) {
          content = `[PDF content]\n${pdfText}\n\n---\n\n[Notes / question]\n${content}`;
        }
      }

      // ── 2b. skipModel — page setup only, no AI call ──────────────────────────
      if (skipModel) {
        const sourceName = currentPage?.name ?? 'Untitled';
        const aiPageName = newChat
          ? await createNewAiChatPage(sourceName)
          : await getOrCreateAiChatPage(sourceName);

        const aiPage = await logseq.Editor.getPage(aiPageName);
        if (!aiPage) return;

        if (pdfPath) {
          const blocks = await logseq.Editor.getPageBlocksTree(aiPageName);
          const firstBlock = blocks?.[0];
          if (firstBlock) {
            await logseq.Editor.upsertBlockProperty(firstBlock.uuid, 'file-path', pdfPath);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
        await logseq.App.openInRightSidebar(aiPage.uuid);
        await logseq.Editor.insertBlock(uuid, `[[${aiPageName}]]${tag}`, {
          before: false,
          sibling: true,
        });
        return;
      }

      // ── 2c. source page context (for chat pages) ─────────────────────────────
      if (includeSourcePage) {
        const blocks = await logseq.Editor.getPageBlocksTree(currentPage?.name ?? '');
        const firstBlock = blocks?.[0];


        let sourceName =
          firstBlock?.properties?.aiSource ??
          firstBlock?.properties?.['ai-source'];
       

        if (!sourceName) {
          console.warn('[logseq-ai] missing ai-source property on this page');
        } else {
          if (typeof sourceName === 'string') {
            sourceName = sourceName.replace(/^\[\[|\]\]$/g, '');
          }
          const sourcePage = await logseq.Editor.getPage(sourceName);
          if (sourcePage) {
            const sourceContent = await getPageContent(sourcePage.name);
            if (sourceContent?.trim()) {
              content = `[Source notes: "${sourceName}"]\n${sourceContent}\n\n---\n\n${content}`;
            }
          }
        }
      }

      // ── 3. streaming decision ────────────────────────────────────────────────
      const listed     = Array.isArray(format);
      const structured = typeof format === 'object' && !listed;
      const useParser  = listed || structured;

      const useStreaming =
        !multiBlock && !useParser &&
        (promptStreaming !== undefined ? promptStreaming : globalStreaming);

      // ── 4. build model + prompt ──────────────────────────────────────────────
      const model = new ChatOpenAI(
        { openAIApiKey: apiKey, modelName, streaming: useStreaming },
        { basePath },
      );

      const defaultSystem = 'You are a helpful assistant and will support the user with any task.';
      const template = ChatPromptTemplate.fromMessages([
        ['system', system || defaultSystem],
        ['user', prompt.replace('{{text}}', '{content}')],
      ]);
      const input = await template.formatMessages({ content });

      // ── 5. side-page output ──────────────────────────────────────────────────
      if (outputMode === OutputMode.sidePage) {
        if (useStreaming) {
          const modelStream = await model.stream(input);
          await handleSidePageOutput({
            sourcePageName: currentPage?.name ?? 'Untitled',
            question: block.content,
            sourceBlockUuid: uuid,
            tag,
            modelStream,
          });
        } else {
          const message = await model.call(input);
          await handleSidePageOutput({
            sourcePageName: currentPage?.name ?? 'Untitled',
            question: block.content,
            sourceBlockUuid: uuid,
            tag,
            response: message.content.toString(),
          });
        }
        return;
      }

      // ── 6. inline streaming ──────────────────────────────────────────────────
      if (useStreaming && output === PromptOutputType.insert) {
        const placeholder = await logseq.Editor.insertBlock(uuid, '…', {
          before: false,
          sibling: sibling ?? false,
        });
        if (placeholder) {
          const modelStream = await model.stream(input);
          await streamIntoBlock(placeholder.uuid, modelStream, tag);
        }
        return;
      }

      // ── 7. non-streaming call ────────────────────────────────────────────────
      const message  = await model.call(input);
      const rawResponse = message.content.toString();

      // Apply sanitizer — singleBlock=false for multiBlock (each line its own block)
      const response = sanitizeForLogseq(rawResponse, !multiBlock);

      // Multi-block insert: one sibling per non-empty line
      if (multiBlock && output === PromptOutputType.insert && !useParser) {
        const lines = response.split('\n').filter((l) => l.trim());
        let prevUuid = uuid;
        for (const line of lines) {
          const nb = await logseq.Editor.insertBlock(prevUuid, `${line}${tag}`, {
            before: false,
            sibling: true,
          });
          if (nb) prevUuid = nb.uuid;
        }
        return;
      }

      // ── 8. standard output ───────────────────────────────────────────────────
      let parser: StructuredOutputParser<any> | CustomListOutputParser | undefined;
      if (structured) {
        parser = StructuredOutputParser.fromNamesAndDescriptions(
          format as { [key: string]: string },
        );
      } else if (listed) {
        parser = new CustomListOutputParser({ separator: '\n' });
      }

      switch (output) {
        case PromptOutputType.property: {
          let blockContent = `${block.content}${tag}\n`;
          if (!parser) {
            blockContent += `${name.toLowerCase()}:: ${response}`;
          } else if (structured) {
            const record = await (parser as StructuredOutputParser<any>).parse(response);
            blockContent += `${name.toLowerCase()}:: ` +
              Object.entries(record).map(([k, v]) => `${k}: ${v}`).join(' ');
          } else if (listed) {
            const list = (await parser!.parse(response)) as string[];
            blockContent += `${name.toLowerCase()}:: ` + list.join(', ');
          }
          await logseq.Editor.updateBlock(uuid, blockContent);
          break;
        }

        case PromptOutputType.insert: {
          if (!parser) {
            await logseq.Editor.insertBlock(uuid, `${response}${tag}`, {
              sibling: sibling ?? false,
            });
          } else if (structured) {
            const record = await (parser as StructuredOutputParser<any>).parse(response);
            await logseq.Editor.updateBlock(uuid, `${block.content}${tag}\n`);
            for (const [key, value] of Object.entries(record))
              await logseq.Editor.insertBlock(uuid, `${key}: ${value}`);
          } else if (listed) {
            const list = (await parser!.parse(response)) as string[];
            await logseq.Editor.updateBlock(uuid, `${block.content}${tag}\n`);
            for (const item of list)
              await logseq.Editor.insertBlock(uuid, item);
          }
          break;
        }

        case PromptOutputType.replace:
          await logseq.Editor.updateBlock(uuid, `${response}${tag}`);
          break;

        case PromptOutputType.append:
          await logseq.Editor.updateBlock(uuid, `${block.content} ${response}${tag}`);
          break;
      }
    });
  }
}

logseq.useSettingsSchema(settings).ready(() => {
  main();
  logseq.onSettingsChanged(main);
}).catch(console.error);
