import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardPdf: IPrompt = {
  name: 'Flashcards (from PDF only)',
  system: 'You create Logseq flashcards from PDF source material.',
  prompt: `Generate flashcards from the [PDF content] for the most important concepts in the material.\n\nRules:\n- Only card the most important concepts, key facts, definitions, and core mechanisms — not every detail\n- Skip transitional text, minor examples used only for illustration, and supporting detail\n- Aim for a focused set of high-value cards, not exhaustive coverage\n- Format EXACTLY: Question:: Answer #card\n- One card per line, nothing else\n\n{content}`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: ContextType.page,
  usePdf: true,
  multiBlock: true,
  sibling: false,
};