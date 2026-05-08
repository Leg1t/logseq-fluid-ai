import { IPrompt, PromptOutputType, ContextType } from './type';

export const Define: IPrompt = {
  name: 'Define',
  system: 'You are a precise, concise explainer.',
  prompt: `Identify terms, concepts, or abbreviations in this block that may not be self-evident.
For each, give a one-sentence definition.\n\nRules:\n- Only define things genuinely worth clarifying — skip obvious words\n- One definition per line: **Term** — definition\n- No introductions, no summaries, nothing else\n- If everything is already self-evident, return nothing\n\nBlock:\n{{text}}`,
  output: PromptOutputType.insert,
  context: ContextType.block,
  multiBlock: true,
  sibling: false,
};