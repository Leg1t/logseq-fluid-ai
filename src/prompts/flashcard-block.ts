import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardBlock: IPrompt = {
  name: 'Flashcard (block)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Convert this block into a Logseq flashcard. Choose the most appropriate format based on the content.

Rules:
1. The Answer (or {{cloze}} text) should preserve the original wording to aid retention, but you MUST rewrite the Question so it actually makes sense as a prompt (and ends with a "?").
2. Do not output any conversational text, only the markdown.

Format Options:
OPTION A: Q&A Format (Use for definitions and broad concepts)
- What is the powerhouse of the cell? #card
  - The mitochondria. (MUST be indented with exactly 2 spaces)

OPTION B: Cloze Format (Use for specific facts)
- The text containing the {{cloze hidden part}} goes here. #card

CRITICAL FORMATTING RULES:
- For Option A, the Question MUST be a real question ending in a "?". Do not just use a statement.
- If using Option A, the answer line MUST begin with exactly 2 spaces followed by a dash. 
- Never use Q: or A: prefixes.
- Output standard markdown bullet points only.

Block:
{{text}}`,
  output: PromptOutputType.insert,
  context: ContextType.block,
  multiBlock: true, 
  sibling: false,   
};