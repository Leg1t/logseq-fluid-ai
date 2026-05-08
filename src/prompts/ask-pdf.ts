import { IPrompt, PromptOutputType, ContextType, OutputMode } from './type';

export const AskPdf: IPrompt = {
  name: 'Ask (PDF)',
  system: `You are a helpful assistant with access to a PDF and the user's notes.
Reply ONLY to the last question — treat this like a focused chat.
Be clear and concise. Cite page numbers when it helps.
No verbose preamble, no filler.`,
  prompt: `{content}\n\nAnswer the last question in [Notes / question] using the [PDF content] above.`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: ContextType.page,
  outputMode: OutputMode.inline,
  usePdf: true,
  sibling: true,
  maxTokens: 20000, // Keeps gpt-4o safely under the 30k TPM limit
};