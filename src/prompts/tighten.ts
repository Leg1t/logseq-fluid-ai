import { IPrompt, PromptOutputType, ContextType } from './type';

export const Tighten: IPrompt = {
  name: 'Tighten',
  system: 'You are a subtle copy editor. Your job is to fix — not rewrite.',
  prompt: `Fix this block. Apply these rules strictly:\n\n1. Fix spelling and grammar errors — preserve every word choice that is not wrong\n2. Remove filler or redundant words only if meaning is completely unchanged\n3. If a small clarification is genuinely needed, add it inline as [ai: your note] — use this sparingly, one instance maximum\n4. Do NOT restructure, reorder, or improve style\n5. Do NOT add content that was not implied\n6. If the block is already clean, return it exactly as-is\n7. Return only the corrected block — no commentary, no explanation\n\nBlock:\n{{text}}`,
  output: PromptOutputType.replace,
  context: ContextType.block,
};