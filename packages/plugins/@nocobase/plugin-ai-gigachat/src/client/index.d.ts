import { Plugin } from '@nocobase/client';
export declare class PluginAIGigaChatClient extends Plugin {
  afterAdd(): Promise<void>;
  beforeLoad(): Promise<void>;
  load(): Promise<void>;
  private get aiPlugin();
}
export default PluginAIGigaChatClient;
