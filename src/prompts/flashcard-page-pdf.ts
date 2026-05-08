import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPagePdf: IPrompt = {
  name: 'Flashcard (page + PDF context)',
  system: 'You create Logseq flashcards. Preserve original wording from the notes as closely as possible.',
  prompt: `Generate flashcards from the [Notes / question] section only.
Use the [PDF content] purely as background context to make better cards — do NOT create cards from PDF content that isn't reflected in the notes.

Rules:
- Only card content that appears in the notes
- Any block already containing #card is already a flashcard — skip it
- Only card the most important concepts, key facts, definitions, and relationships — not every detail
- Skip transitional sentences, minor examples, and context-setting text
- Preserve original wording from the notes as much as possible
- Format EXACTLY: Question:: Answer #card
- One card per line, nothing else

{content}`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: ContextType.page,
  usePdf: true,
  multiBlock: true,
  sibling: false,
  maxTokens: 20000,
};