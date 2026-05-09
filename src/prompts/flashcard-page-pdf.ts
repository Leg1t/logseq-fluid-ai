import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPagePdf: IPrompt = {
  name: 'Flashcard (page + PDF context)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Generate flashcards from the [Notes / question] section only. Choose the most appropriate format for each piece of information.
Use the [PDF content] purely as background context to make better cards — do NOT create cards from PDF content that isn't reflected in the notes.

Rules:
1. Only card content that appears in the notes.
2. Skip blocks that already contain #card.
3. Only card the most important concepts, key facts, definitions, and relationships.
4. Preserve the original wording from the notes as much as possible for both questions and answers to aid retention.

Format Options:
OPTION A: Q&A Format (Use for definitions, broad concepts, or "What is X?" questions)
- Question goes here #card
  - Answer goes here

OPTION B: Cloze Format (Use for specific facts, dates, or complex sentences where context matters)
- The powerhouse of the cell is the {{cloze mitochondria}}. #card

Output format requirement:
- Output standard markdown bullet points. Use standard indentation (2 spaces) for answers under questions.
- Do NOT output any conversational text, only the markdown lists.

{content}`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: ContextType.page,
  usePdf: true,
  multiBlock: true,
  sibling: false,
  maxTokens: 20000,
};