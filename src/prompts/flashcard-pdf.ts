
import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPdf: IPrompt = {
  name: 'Flashcards (from PDF only)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Generate flashcards from the [PDF content] for the most important material. Choose the best format for each idea.

Rules:
1. Only card the important concepts, key facts, definitions, and core mechanisms. One idea per card.
2. Keep the answer (or {{cloze}} text) faithful to the source wording to aid retention, but rewrite the question so it works as a real prompt and ends with a "?".
3. Skip transitional text, minor examples, and filler.

Format Options:
OPTION A — Q&A (use for definitions and broader concepts):
- What is the powerhouse of the cell? #card
  - The mitochondria.

OPTION B — Cloze (use for a specific term, name, or number):
- The powerhouse of the cell is the {{cloze mitochondria}}. #card

Output rules:
- For Q&A, the question MUST be a real question ending in "?", and the answer MUST be an indented child bullet.
- Never use "Q:" or "A:" prefixes.
- Output only the card bullets — no preamble, no explanation, and no parenthetical remarks about formatting or your reasoning.

{content}`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: ContextType.page,
  usePdf: true,
  multiBlock: true,
  sibling: false,
  maxTokens: 20000,
};
