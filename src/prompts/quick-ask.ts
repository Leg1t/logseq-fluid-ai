import { IPrompt, PromptOutputType, ContextType } from './type';

export const QuickAsk: IPrompt = {
  name: 'Quick Ask',
  system: 'You are a helpful assistant.',
  prompt: `Answer the question in this block.\n\nRules:\n- Answer directly and concisely\n- Add minimal context only if truly needed\n- Return ONLY the answer in clean Markdown\n- No introductions, no reasoning, no follow-up questions\n- Short sentences separated by line breaks\n- If multiple points needed, separate with "•" inline\n\nBlock:\n{{text}}`,
  output: PromptOutputType.insert,
  context: ContextType.block,
  sibling: false,
};