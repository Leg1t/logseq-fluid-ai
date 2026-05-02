import { IPrompt, PromptOutputType } from './type';

export const AskPdf: IPrompt = {
  name: 'Ask (PDF)',
  system: `You are a helpful assistant with access to a PDF and the user's notes.
Reply ONLY to the last question — treat this like a focused chat.
Be clear and concise. Cite page numbers when it helps.
No verbose preamble, no filler.`,
  prompt: `{content}

Answer the last question in [Notes / question] using the [PDF content] above.`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: 'page' as any,
  outputMode: 'inline' as any,
  usePdf: true,
  sibling: true,
};
