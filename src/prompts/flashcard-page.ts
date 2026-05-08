import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPage: IPrompt = {
  name: 'Flashcard (page)',
  system: 'You create Logseq flashcards. Preserve original wording as closely as possible.',
  prompt: `Generate flashcards from these notes.\n\nRules:\n- Any block already containing #card is already a flashcard — skip it entirely\n- Only generate cards for new content without #card\n- If everything already has a #card, return nothing at all\n- Only card the most important concepts, key facts, and definitions — not everything\n- Skip transitional sentences, context-setting, and minor details\n- Preserve original wording as much as possible — do not paraphrase\n- Format EXACTLY: Question:: Answer #card\n- One card per line, nothing else — no headings, no lists, no extra text\n\nNotes:\n{content}`,
  output: PromptOutputType.insert,
  context: ContextType.page,
  multiBlock: true,
  sibling: false,
};