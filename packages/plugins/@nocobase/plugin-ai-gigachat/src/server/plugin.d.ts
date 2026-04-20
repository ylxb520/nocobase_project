import { Plugin } from '@nocobase/server';
export declare class PluginAIGigaChatServer extends Plugin {
  afterAdd(): Promise<void>;
  beforeLoad(): Promise<void>;
  load(): Promise<void>;
  install(): Promise<void>;
  afterEnable(): Promise<void>;
  afterDisable(): Promise<void>;
  remove(): Promise<void>;
  private get aiPlugin();
}
export default PluginAIGigaChatServer;
