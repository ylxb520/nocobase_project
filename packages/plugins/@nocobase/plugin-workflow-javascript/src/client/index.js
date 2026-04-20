import { Plugin } from '@nocobase/client';
import ScriptInstruction from './ScriptInstruction';
export class PluginWorkflowScriptClient extends Plugin {
    async load() {
        const workflow = this.app.pm.get('workflow');
        workflow.registerInstruction('script', ScriptInstruction);
    }
}
export default PluginWorkflowScriptClient;
//# sourceMappingURL=index.js.map