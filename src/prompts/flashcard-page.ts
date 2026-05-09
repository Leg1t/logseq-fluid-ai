import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPage: IPrompt = {
  name: 'Flashcard (page)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Generate flashcards from the provided notes. Choose the most appropriate format for each piece of information.

Rules:
1. Skip blocks that already contain #card.
2. Only card important concepts, definitions, and relationships.
3. The Answer (or {{cloze}} text) should preserve the original wording to aid retention, but you MUST rewrite the Question so it actually makes sense as a prompt (and ends with a "?").

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

Notes:
{content}`,
  output: PromptOutputType.insert,
  context: ContextType.page,
  multiBlock: true,
  sibling: false,
};