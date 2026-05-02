import { IPrompt, PromptOutputType } from './type';

export const FlashcardPage: IPrompt = {
  name: 'Flashcard (page)',
  system: 'You create Logseq flashcards. Preserve original wording as closely as possible.',
  prompt: `Generate flashcards from these notes.

Rules:
- Any block already containing #card is already a flashcard — skip it entirely
- Only generate cards for new content without #card
- If everything already has a #card, return nothing at all
- Only card the most important concepts, key facts, and definitions — not everything
- Skip transitional sentences, context-setting, and minor details
- Preserve original wording as much as possible — do not paraphrase
- Format EXACTLY: Question:: Answer #card
- One card per line, nothing else — no headings, no lists, no extra text

Notes:
{content}`,
  output: PromptOutputType.insert,
  context: 'page' as any,
  multiBlock: true,
  sibling: false,
};
