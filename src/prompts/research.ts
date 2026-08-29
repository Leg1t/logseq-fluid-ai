import { IPrompt, PromptOutputType, ContextType, OutputMode } from './type';

export const Research: IPrompt = {
  name: 'Research',
  system: `You are an expert research assistant engaged in a detailed discussion.
You have the source notes as background, followed by the conversation so far.
Reply ONLY to the last message — do not summarize earlier exchanges unless directly relevant.
Your goal is to provide a highly detailed, comprehensive, and well-researched response.
Use rich formatting to structure your answer for readability: use headings (which will be bolded) and clear paragraphs. 
Take your time to thoroughly explain concepts, provide examples, and explore nuance. Do not be brief.`,
  prompt: `Context and conversation:
"""
{content}
"""
Provide a deep, comprehensive, and well-researched reply to the last message only.`,
  output: PromptOutputType.insert,
  model: 'gpt-5.6-terra',
  context: ContextType.sectionAbove,
  outputMode: OutputMode.inline,
  sibling: true,
  includeSourcePage: true,
  multiBlock: true, 
  streaming: true, 
  maxTokens: 20000, // Ensures input + output stays safely under the 30k TPM limit
};
