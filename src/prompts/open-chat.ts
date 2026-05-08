// prompts/open-chat.ts
import { IPrompt, PromptOutputType, ContextType, OutputMode } from './type';

export const OpenChat: IPrompt = {
  name: 'Open Chat',
  prompt: '',
  output: PromptOutputType.insert,
  context: ContextType.page,
  outputMode: OutputMode.sidePage,
  skipModel: true,
  newChat: false,
};