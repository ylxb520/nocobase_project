/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { evaluators } from '@nocobase/evaluators';
import { Instruction } from '.';
import { JOB_STATUS } from '../constants';
export class CalculationInstruction extends Instruction {
    async run(node, prevJob, processor) {
        const { engine = 'math.js', expression = '' } = node.config;
        const scope = processor.getScope(node.id);
        const evaluator = evaluators.get(engine);
        try {
            const result = evaluator && expression ? evaluator(expression, scope) : null;
            return {
                result,
                status: JOB_STATUS.RESOLVED,
            };
        }
        catch (e) {
            return {
                result: e.toString(),
                status: JOB_STATUS.ERROR,
            };
        }
    }
    async test({ engine = 'math.js', expression = '' }) {
        const evaluator = evaluators.get(engine);
        try {
            const result = evaluator && expression ? evaluator(expression) : null;
            return {
                result,
                status: JOB_STATUS.RESOLVED,
            };
        }
        catch (e) {
            return {
                result: e.toString(),
                status: JOB_STATUS.ERROR,
            };
        }
    }
}
export default CalculationInstruction;
//# sourceMappingURL=CalculationInstruction.js.map