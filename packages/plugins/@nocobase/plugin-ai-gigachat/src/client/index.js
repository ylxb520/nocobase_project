import { Plugin } from '@nocobase/client';
import { gigachatProviderOptions } from './llm-providers/gigachat';
export class PluginAIGigaChatClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }
  async beforeLoad() {}
  // You can get and modify the app instance here
  async load() {
    this.aiPlugin.aiManager.registerLLMProvider('gigachat', gigachatProviderOptions);
  }
  get aiPlugin() {
    return this.app.pm.get('ai');
  }
}
export default PluginAIGigaChatClient;
//# sourceMappingURL=index.js.map
