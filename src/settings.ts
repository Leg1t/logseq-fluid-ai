import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
import { IPrompt } from './prompts/type';

export interface ISettings {
  apiKey: string;
  basePath: string;
  model: string;
  tag: string;
  streaming: boolean;
  autoPdf: boolean;
  maxTokens: number;
  customPrompts: {
    enable: boolean;
    prompts: IPrompt[];
  };
}

const settings: SettingSchemaDesc[] = [
  {
    key: 'apiKey',
    type: 'string',
    title: 'API Key',
    description: 'Enter your OpenAI API key.',
    default: '',
  },
  {
    key: 'basePath',
    type: 'string',
    title: 'OpenAI Base Path',
    description: 'Proxy or alternative base URL.',
    default: 'https://api.openai.com/v1',
  },
  {
    key: 'model',
    type: 'string',
    title: 'Model',
    description: 'e.g. "gpt-4o" or "gpt-4o-mini".',
    default: 'gpt-4o-mini',
  },
  {
    key: 'maxTokens',
    type: 'number',
    title: 'Max Context Tokens',
    description: 'Maximum tokens to use for context (notes + PDF). A sliding window keeps the most recent content. 1 token ≈ 4 characters.',
    default: 100000,
  },
  {
    key: 'tag',
    type: 'string',
    title: 'Tag',
    description: 'Appended to every AI-generated block.',
    default: 'AI',
  },
  {
    key: 'streaming',
    type: 'boolean',
    title: 'Enable Streaming',
    description:
      'Stream tokens into the block as they arrive. Recommended for side-page chat and long responses.',
    default: false,
  },
  {
    key: 'autoPdf',
    type: 'boolean',
    title: 'Auto-attach PDF',
    description:
      'When you run any AI command on a PDF annotation page, automatically include the PDF text as context.',
    default: true,
  },
  {
    key: 'customPrompts',
    type: 'object',
    title: 'Custom Prompts',
    description: 'Enable and manage custom prompts. You can override maxTokens here.',
    default: { enable: false, prompts: [] },
  },
];

export default settings;