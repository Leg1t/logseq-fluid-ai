// prompts/open-chat.ts
import { IPrompt, PromptOutputType } from './type';

export const OpenChat: IPrompt = {
  name: 'Open Chat',
  prompt: '',
  output: PromptOutputType.insert,
  context: 'page' as any,
  outputMode: 'side-page' as any,
  skipModel: true,
  newChat: false,
};
