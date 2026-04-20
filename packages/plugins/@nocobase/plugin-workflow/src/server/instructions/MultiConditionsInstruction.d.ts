/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Instruction } from '.';
import type Processor from '../Processor';
import type { FlowNodeModel, JobModel } from '../types';
export declare class MultiConditionsInstruction extends Instruction {
    run(node: FlowNodeModel, prevJob: any, processor: Processor): Promise<JobModel>;
    resume(node: FlowNodeModel, branchJob: JobModel, processor: Processor): Promise<any>;
    private evaluateCondition;
    private getBranchNode;
}
export default MultiConditionsInstruction;
