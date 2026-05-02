// ── quick-ask.ts ──────────────────────────────────────────────────────────────
// prompts/quick-ask.ts

import { IPrompt, PromptOutputType } from './type';

export const QuickAsk: IPrompt = {
  name: 'Quick Ask',
  system: 'You are a helpful assistant.',
  prompt: `Answer the question in this block.

Rules:
- Answer directly and concisely
- Add minimal context only if truly needed
- Return ONLY the answer in clean Markdown
- No introductions, no reasoning, no follow-up questions
- Short sentences separated by line breaks
- If multiple points needed, separate with "•" inline

Block:
{{text}}`,
  output: PromptOutputType.insert,
  context: 'block' as any,
  sibling: false,
};
