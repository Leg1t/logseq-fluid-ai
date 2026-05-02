// prompts/ask-chat.ts
import { IPrompt, PromptOutputType } from './type';

export const AskChat: IPrompt = {
  name: 'Ask (chat)',
  system: `You are a helpful assistant in an ongoing discussion.
You have the source notes as background, then the conversation so far.
Reply ONLY to the last message — do not re-address earlier exchanges.
Be clear and direct. Two to four sentences unless a longer answer is genuinely needed.
No introductions, no sign-offs, no filler.`,
  prompt: `Context and conversation:
"""
{content}
"""
Reply to the last message only.`,
  output: PromptOutputType.insert,
  model: 'gpt-4o',
  context: 'section-above' as any,
  outputMode: 'inline' as any,
  sibling: true,
  includeSourcePage: true,
};
