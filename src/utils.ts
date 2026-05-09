import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import * as pdfjsLib from 'pdfjs-dist';

// ─── existing ────────────────────────────────────────────────────────────────

export async function getBlockContent(
  block: BlockEntity,
  parentBlock = true,
  level = 1,
  content = '',
): Promise<string> {
  if (parentBlock) content = block.content ?? '';
  const childrens = [block.children];
  while (childrens.length > 0) {
    const children = childrens.shift();
    for (const child of children!) {
      content += '\n' + '\t'.repeat(level) + '- ' + (child as BlockEntity).content;
      content += await getBlockContent(child as BlockEntity, false, level + 1);
    }
  }
  return content;
}

// ─── context helpers ─────────────────────────────────────────────────────────

export async function getPageContent(pageName: string): Promise<string> {
  const blocks = await logseq.Editor.getPageBlocksTree(pageName);
  if (!blocks?.length) return '';
  const parts: string[] = [];
  for (const block of blocks) parts.push(await getBlockContent(block));
  return parts.join('\n');
}

export async function getSectionAbove(uuid: string): Promise<string> {
  const block = await logseq.Editor.getBlock(uuid);
  if (!block) return '';
  const page = await logseq.Editor.getPage(block.page.id);
  if (!page) return '';
  const allBlocks = await logseq.Editor.getPageBlocksTree(page.name);
  if (!allBlocks) return '';

  const lines: string[] = [];
  let found = false;

  function traverse(blocks: BlockEntity[], depth = 0): void {
    for (const b of blocks) {
      if (found) return;
      if (b.uuid === uuid) { found = true; return; }
      lines.push('\t'.repeat(depth) + '- ' + (b.content ?? ''));
      if (b.children?.length) traverse(b.children as BlockEntity[], depth + 1);
    }
  }

  traverse(allBlocks);
  return found ? lines.join('\n') : '';
}

// ─── PDF helpers ─────────────────────────────────────────────────────────────

/** ~120 k chars ≈ ~30 k tokens — hard ceiling before page range is applied. */
const MAX_CHARS = 120_000;

export async function getPagePdfPath(pageName: string): Promise<string | null> {
  try {
    const page = await logseq.Editor.getPage(pageName);
    if (!page) return null;

    const props = (page as any).properties ?? {};
    const fromPage =
      props['file-path'] ??
      props.filePath ??
      (page as any)['file-path'] ??
      null;

    if (fromPage) return fromPage;

    const blocks = await logseq.Editor.getPageBlocksTree(pageName);
    const firstBlock = blocks?.[0];
    if (!firstBlock) return null;

    const blockProps = await logseq.Editor.getBlockProperties(firstBlock.uuid);
    return blockProps?.['file-path'] ?? blockProps?.filePath ?? null;
  } catch (e) {
    console.error('[logseq-ai] getPagePdfPath failed:', e);
    return null;
  }
}

/**
 * Extract plain text from a local PDF asset.
 *
 * @param filePath  Logseq asset path, e.g. ../assets/MyBook.pdf
 * @param pageRange Optional [firstPage, lastPage] (1-based, inclusive).
 */
export async function getPdfContent(
  filePath: string,
  pageRange?: [number, number],
): Promise<string | null> {
  try {
    const graph = await logseq.App.getCurrentGraph();
    if (!graph) {
      console.error('[logseq-ai] no graph found');
      return null;
    }

    console.log('[logseq-ai] graph.path:', graph.path);
    console.log('[logseq-ai] filePath received:', filePath);

    const relative = filePath.replace(/^\.\.\//, '');
    const absolute = `${graph.path}/${relative}`;
    const fileUrl = encodeURI(`file://${absolute}`);

    console.log('[logseq-ai] fetching PDF from:', fileUrl);

    const res = await fetch(fileUrl);
    if (!res.ok) {
      console.warn(`[logseq-ai] fetch failed — status ${res.status}, url: ${fileUrl}`);
      return null;
    }

    const buffer = await res.arrayBuffer();

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
    }).promise;

    const startPage = Math.max(1, pageRange?.[0] ?? 1);
    const endPage   = Math.min(pdf.numPages, pageRange?.[1] ?? pdf.numPages);

    const parts: string[] = [];
    let totalChars = 0;

    for (let i = startPage; i <= endPage; i++) {
      if (totalChars >= MAX_CHARS) {
        parts.push('\n…[truncated: MAX_CHARS limit reached]');
        break;
      }
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      const pageText = tc.items
        .map((item) => ('str' in item ? (item as { str: string }).str : ''))
        .join(' ');
      parts.push(`[Page ${i}]\n${pageText}`);
      totalChars += pageText.length;
    }

    return parts.join('\n\n');
  } catch (err) {
    console.error('[logseq-ai] PDF extraction failed:', err);
    return null;
  }
}

// ─── side-page helpers ────────────────────────────────────────────────────────

export async function getOrCreateAiChatPage(sourcePageName: string): Promise<string> {
  const aiPageName = `AI/${sourcePageName}`;
  const existing = await logseq.Editor.getPage(aiPageName);

  if (!existing) {
    await logseq.Editor.createPage(aiPageName, {}, {
      redirect: false,
      createFirstBlock: true,
    });
  }

  const blocks = await logseq.Editor.getPageBlocksTree(aiPageName);
  const firstBlock = blocks?.[0];
  if (firstBlock) {
    await logseq.Editor.upsertBlockProperty(firstBlock.uuid, 'ai-source', sourcePageName);
  }

  return aiPageName;
}

export async function createNewAiChatPage(sourcePageName: string): Promise<string> {
  const timestamp = new Date()
    .toISOString()
    .slice(0, 16)
    .replace('T', ' ')
    .replace(/:/g, '-');

  const aiPageName = `AI/${sourcePageName}/${timestamp}`;

  await logseq.Editor.createPage(aiPageName, {}, {
    redirect: false,
    createFirstBlock: true,
  });

  const blocks = await logseq.Editor.getPageBlocksTree(aiPageName);
  const firstBlock = blocks?.[0];
  if (firstBlock) {
    await logseq.Editor.upsertBlockProperty(firstBlock.uuid, 'ai-source', sourcePageName);
  }

  return aiPageName;
}

// ─── output sanitizer ────────────────────────────────────────────────────────

/**
 * Strip markdown structures Logseq cannot render inside a single block.
 *
 * singleBlock = true  (default) — headings → bold, list markers → • inline
 * singleBlock = false (multiBlock) — headings → bold, list markers stripped
 *   so each line becomes a clean standalone block
 */
export function sanitizeForLogseq(text: string, singleBlock = true): string {
  let result = text
    // ## Heading  →  **Heading**
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**');

  if (singleBlock) {
    result = result
      .replace(/^[\-\*]\s+/gm, '• ')
      .replace(/^\d+\.\s+/gm, '• ');
  } else {
    result = result
      .replace(/^[\-\*]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '');
  }

  return result.replace(/\n{3,}/g, '\n\n').trim();
}

export interface IBatchBlock {
  content: string;
  children?: IBatchBlock[];
}

/**
 * A general-purpose markdown list parser.
 * Builds a Logseq block tree based STRICTLY on whitespace indentation.
 */
export function parseMarkdownToTree(markdown: string): IBatchBlock[] {
  const lines = markdown.split('\n').filter(l => l.trim().length > 0);
  const root: IBatchBlock[] = [];
  
  // Stack keeps track of the current hierarchy chain
  const stack: { indent: number, block: IBatchBlock }[] = [];

  for (let line of lines) {
    // 1. Count the exact number of leading spaces
    const indentMatch = line.match(/^(\s*)/);
    const indentLevel = indentMatch ? indentMatch[1].length : 0;

    // 2. Clean the line (remove spaces, dashes, bullets, and Q/A markers)
    const cleanContent = line
      .replace(/^[\s\-*•]+/, '')
      .replace(/^(Q|A):\s*/i, '')
      .trim();

    if (!cleanContent) continue;

    const newBlock: IBatchBlock = { content: cleanContent, children: [] };

    // 3. Go back up the tree until we find the parent (a block with FEWER spaces)
    while (stack.length > 0 && stack[stack.length - 1].indent >= indentLevel) {
      stack.pop();
    }

    // 4. Attach the block to its parent, or to the root if it has no parent
    if (stack.length === 0) {
      root.push(newBlock); // It's a top-level block
    } else {
      stack[stack.length - 1].block.children!.push(newBlock); // It's a child block
    }

    // 5. Add this block to the stack so future lines can nest under it
    stack.push({ indent: indentLevel, block: newBlock });
  }

  return root;
}