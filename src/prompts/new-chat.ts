import { IPrompt, PromptOutputType, ContextType, OutputMode } from './type';

export const NewChat: IPrompt = {
  name: 'New Chat',
  prompt: '',
  output: PromptOutputType.insert,
  context: ContextType.page,
  outputMode: OutputMode.sidePage,
  skipModel: true,
  newChat: true,
};