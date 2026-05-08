import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardBlock: IPrompt = {
  name: 'Flashcard (block)',
  system: 'You create Logseq flashcards. Preserve the original wording as closely as possible.',
  prompt: `Convert this block into a single Logseq flashcard.\n\nRules:\n- Preserve original wording as much as possible — do not paraphrase\n- Format EXACTLY: Question:: Answer #card\n- One line only, nothing else\n\nBlock:\n{{text}}`,
  output: PromptOutputType.insert,
  context: ContextType.block,
  multiBlock: false,
  sibling: true,
};