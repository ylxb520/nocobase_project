import { Plugin } from '@nocobase/server';
import { gigaChatProviderOptions } from './llm-providers/gigachat';
export class PluginAIGigaChatServer extends Plugin {
  async afterAdd() {}
  async beforeLoad() {}
  async load() {
    this.aiPlugin.aiManager.registerLLMProvider('gigachat', gigaChatProviderOptions);
  }
  async install() {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
  get aiPlugin() {
    return this.app.pm.get('ai');
  }
}
export default PluginAIGigaChatServer;
//# sourceMappingURL=plugin.js.map
