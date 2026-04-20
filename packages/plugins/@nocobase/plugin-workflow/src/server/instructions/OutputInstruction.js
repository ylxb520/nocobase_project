/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Instruction } from '.';
import { JOB_STATUS } from '../constants';
export default class ExecutionResultInstruction extends Instruction {
    async run(node, prevJob, processor) {
        const { value } = node.config;
        const output = processor.getParsedValue(value, node.id);
        try {
            await processor.execution.update({ output: output }, { hooks: false, transaction: processor.mainTransaction });
        }
        catch (e) {
            return {
                result: e.message,
                status: JOB_STATUS.FAILED,
            };
        }
        return {
            result: output,
            status: JOB_STATUS.RESOLVED,
        };
    }
    async resume(node, job, processor) {
        return job;
    }
}
//# sourceMappingURL=OutputInstruction.js.map