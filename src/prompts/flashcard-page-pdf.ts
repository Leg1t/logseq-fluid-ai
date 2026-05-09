import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPagePdf: IPrompt = {
  name: 'Flashcard (page + PDF context)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Generate flashcards from the [Notes / question] section only. Choose the most appropriate format for each piece of information.
Use the [PDF content] purely as background context to make better cards — do NOT create cards from PDF content that isn't reflected in the notes.

Rules:
1. Only card content that appears in the notes.
2. Skip blocks that already contain #card.
3. The Answer (or {{cloze}} text) should preserve the original wording from the notes to aid retention, but you MUST rewrite the Question so it actually functions as a prompt (and ends with a "?").

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