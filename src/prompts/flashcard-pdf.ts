import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPdf: IPrompt = {
  name: 'Flashcards (from PDF only)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Generate flashcards from the [PDF content] for the most important concepts in the material. Choose the most appropriate format for each piece of information.

Rules:
1. Only card the most important concepts, key facts, definitions, and core mechanisms.
2. The Answer (or {{cloze}} text) should preserve the original wording from the text to aid retention, but you MUST rewrite the Question so it actually functions as a prompt (and ends with a "?").
3. Skip transitional text and minor examples.

Format Options:
OPTION A: Q&A Format (Use for definitions and broad concepts)
- What is the powerhouse of the cell? #card
  - The mitochondria. (MUST be indented with exactly 2 spaces)

OPTION B: Cloze Format (Use for specific facts)
- The powerhouse of the cell is the {{cloze mitochondria}}. #card

CRITICAL FORMATTING RULES:
- For Option A, the Question MUST be a real question ending in a "?". Do not just use a statement.
- If using Option A, the answer line MUST begin with exactly 2 spaces followed by a dash. 
- Never use Q: or A: prefixes.
- Output standard markdown bullet points only.

{content}`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: ContextType.page,
  usePdf: true,
  multiBlock: true,
  sibling: false,
  maxTokens: 20000, 
};