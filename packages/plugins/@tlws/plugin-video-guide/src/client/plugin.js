import { Plugin } from '@nocobase/client';
import models from './models';
export class PluginVideoGuideClient extends Plugin {
    async load() {
        this.flowEngine.registerModels(models);
    }
}
export default PluginVideoGuideClient;
//# sourceMappingURL=plugin.js.map