import { IPrompt, PromptOutputType, ContextType } from './type';

export const Rework: IPrompt = {
  name: 'Rework',
  system: `You are a skilled editor. Apply the user's instruction precisely.
Return only the reworked version of the current block — no commentary, no preamble, no explanation.`,
  prompt: `You are given the full page as context, then the current block.
The last line of the page context immediately before the current block is the instruction — apply it to the current block.

Page context (for understanding and instruction):
{content}

Return only the reworked block text.`,
  output: PromptOutputType.replace,
  context: ContextType.page,
};