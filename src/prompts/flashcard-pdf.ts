import { IPrompt, PromptOutputType } from './type';

export const FlashcardPdf: IPrompt = {
  name: 'Flashcards (from PDF only)',
  system: 'You create Logseq flashcards from PDF source material.',
  prompt: `Generate flashcards from the [PDF content] for the most important concepts in the material.

Rules:
- Only card the most important concepts, key facts, definitions, and core mechanisms — not every detail
- Skip transitional text, minor examples used only for illustration, and supporting detail
- Aim for a focused set of high-value cards, not exhaustive coverage
- Format EXACTLY: Question:: Answer #card
- One card per line, nothing else

{content}`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: 'page' as any,
  usePdf: true,
  multiBlock: true,
  sibling: false,
};