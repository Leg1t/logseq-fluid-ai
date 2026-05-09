import { IPrompt, PromptOutputType, ContextType } from './type';

export const FlashcardBlock: IPrompt = {
  name: 'Flashcard (block)',
  system: 'You are an expert study aid generator for Logseq. You create active-recall flashcards.',
  prompt: `Convert this block into a Logseq flashcard. Choose the most appropriate format based on the content.

Rules:
1. Preserve the original wording as much as possible for both the question and answer to aid retention.
2. Do not output any conversational text, only the markdown.

Format Options:
OPTION A: Q&A Format
- Question goes here #card
  - Answer goes here

OPTION B: Cloze Format
- The text containing the {{cloze hidden part}} goes here. #card

Block:
{{text}}`,
  output: PromptOutputType.insert,
  context: ContextType.block,
  multiBlock: true, 
  sibling: false,   
};