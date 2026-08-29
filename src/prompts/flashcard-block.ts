
import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardBlock: IPrompt = {
  name: 'Flashcard (block)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Convert this block into one or more Logseq flashcards. Choose the most appropriate format based on the content.

Rules:
1. Keep the answer (or {{cloze}} text) faithful to the original wording to aid retention, but rewrite the question so it works as a real prompt and ends with a "?".
2. One idea per card. If the block holds several testable facts, make several cards.

Format Options:
OPTION A — Q&A (use for definitions and broader concepts):
- What is the powerhouse of the cell? #card
  - The mitochondria.

OPTION B — Cloze (use for a specific term, name, or number):
- The text containing the {{cloze hidden part}} goes here. #card

Output rules:
- For Q&A, the question MUST be a real question ending in "?", and the answer MUST be an indented child bullet.
- Never use "Q:" or "A:" prefixes.
- Output only the card bullets — no preamble, no explanation, and no parenthetical remarks about formatting or your reasoning.

Block:
{{text}}`,
  output: PromptOutputType.insert,
  context: ContextType.block,
  multiBlock: true,
  sibling: false,
};
