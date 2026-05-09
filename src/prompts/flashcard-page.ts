import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPage: IPrompt = {
  name: 'Flashcard (page)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Generate flashcards from the provided notes. Choose the most appropriate format for each piece of information.

Rules:
1. Skip blocks that already contain #card.
2. Only card important concepts, definitions, and relationships.
3. Preserve the original wording from the notes as much as possible for both questions and answers to aid retention.

Format Options:
OPTION A: Q&A Format (Use for definitions, broad concepts, or "What is X?" questions)
- Question goes here #card
  - Answer goes here

OPTION B: Cloze Format (Use for specific facts, dates, or complex sentences where context matters)
- The powerhouse of the cell is the {{cloze mitochondria}}. #card

Output format requirement:
- Output standard markdown bullet points. Use standard indentation (2 spaces) for answers under questions.
- Do NOT output any conversational text, only the markdown lists.

Notes:
{content}`,
  output: PromptOutputType.insert,
  context: ContextType.page,
  multiBlock: true,
  sibling: false,
};