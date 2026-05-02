import { IPrompt, PromptOutputType } from './type';

export const Define: IPrompt = {
  name: 'Define',
  system: 'You are a precise, concise explainer.',
  prompt: `Identify terms, concepts, or abbreviations in this block that may not be self-evident.
For each, give a one-sentence definition.

Rules:
- Only define things genuinely worth clarifying — skip obvious words
- One definition per line: **Term** — definition
- No introductions, no summaries, nothing else
- If everything is already self-evident, return nothing

Block:
{{text}}`,
  output: PromptOutputType.insert,
  context: 'block' as any,
  multiBlock: true,
  sibling: false,
};
