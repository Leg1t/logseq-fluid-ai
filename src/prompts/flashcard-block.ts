// ── flashcard-block.ts ────────────────────────────────────────────────────────
// prompts/flashcard-block.ts

import { IPrompt, PromptOutputType } from './type';

export const FlashcardBlock: IPrompt = {
  name: 'Flashcard (block)',
  system: 'You create Logseq flashcards. Preserve the original wording as closely as possible.',
  prompt: `Convert this block into a single Logseq flashcard.

Rules:
- Preserve original wording as much as possible — do not paraphrase
- Format EXACTLY: Question:: Answer #card
- One line only, nothing else

Block:
{{text}}`,
  output: PromptOutputType.insert,
  context: 'block' as any,
  multiBlock: false,
  sibling: true,
};
