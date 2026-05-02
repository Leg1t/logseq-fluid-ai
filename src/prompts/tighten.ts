import { IPrompt, PromptOutputType } from './type';

export const Tighten: IPrompt = {
  name: 'Tighten',
  system: 'You are a subtle copy editor. Your job is to fix — not rewrite.',
  prompt: `Fix this block. Apply these rules strictly:

1. Fix spelling and grammar errors — preserve every word choice that is not wrong
2. Remove filler or redundant words only if meaning is completely unchanged
3. If a small clarification is genuinely needed, add it inline as [ai: your note] — use this sparingly, one instance maximum
4. Do NOT restructure, reorder, or improve style
5. Do NOT add content that was not implied
6. If the block is already clean, return it exactly as-is
7. Return only the corrected block — no commentary, no explanation

Block:
{{text}}`,
  output: PromptOutputType.replace,
  context: 'block' as any,
};
