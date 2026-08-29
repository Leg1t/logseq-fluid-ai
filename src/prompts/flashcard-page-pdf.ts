
import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPagePdf: IPrompt = {
  name: 'Flashcard (page + PDF context)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Generate flashcards from the [Notes / question] section only. Use the [PDF content] purely as background to write better, more accurate cards — do NOT create cards from PDF passages that aren't reflected in the notes.

Rules:
1. Only card content that appears in the notes. One idea per card.
2. Skip blocks that already contain #card.
3. Keep the answer (or {{cloze}} text) faithful to the note's wording to aid retention, but rewrite the question so it works as a real prompt and ends with a "?".
4. This page grows over time and may already hold flashcards from earlier chapters (blocks with #card and their answer children). Those existing cards are the record of what is already done — do NOT recreate them. Skip any note whose idea is already captured by an existing card, and card only material not yet reflected in the existing #card blocks (in practice, the newest chapter that hasn't been carded). If everything is already carded, produce nothing.

Format Options:
OPTION A — Q&A (use for definitions and broader concepts):
- What is the powerhouse of the cell? #card
  - The mitochondria.

OPTION B — Cloze (use for a specific term, name, or number):
- The powerhouse of the cell is the {{cloze mitochondria}}. #card

Output rules:
- For Q&A, the question MUST be a real question ending in "?", and the answer MUST be ONE indented child bullet — a single block, never split into sub-bullets. Multi-part answers use semicolons inline, or become separate cards.
- Never use "Q:" or "A:" prefixes.
- Output only the card bullets — no preamble, no explanation, and no parenthetical remarks about formatting or your reasoning.

{content}`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: ContextType.page,
  usePdf: true,
  multiBlock: true,
  flashcard: true,
  sibling: false,
  maxTokens: 20000,
};
