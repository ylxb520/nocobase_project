import { Plugin } from '@nocobase/client';
import DateCalculationInstruction from './DateCalculationInstruction';
export class PluginWorkflowDateCalculationClient extends Plugin {
    async afterAdd() {
        // await this.app.pm.add()
    }
    async beforeLoad() { }
    async load() {
        console.log(this.app);
        const workflow = this.app.pm.get('workflow');
        workflow.registerInstruction('dateCalculation', DateCalculationInstruction);
    }
}
export default PluginWorkflowDateCalculationClient;
//# sourceMappingURL=index.js.map