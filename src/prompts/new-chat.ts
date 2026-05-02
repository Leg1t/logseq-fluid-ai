import { IPrompt, PromptOutputType } from './type';

export const NewChat: IPrompt = {
  name: 'New Chat',
  prompt: '',
  output: PromptOutputType.insert,
  context: 'page' as any,
  outputMode: 'side-page' as any,
  skipModel: true,
  newChat: true,
};
