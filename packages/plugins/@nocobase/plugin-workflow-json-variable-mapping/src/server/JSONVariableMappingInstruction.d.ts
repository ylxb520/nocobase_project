/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Processor, Instruction, FlowNodeModel } from '@nocobase/plugin-workflow';
type Variable = {
    key: string;
    path: string;
    title: string;
    children: Array<Variable>;
};
export type JSONVariableMappingInstructionConfig = {
    variables: Array<Variable>;
    dataSource: string;
};
export default class JSONVariableMappingInstruction extends Instruction {
    run(node: FlowNodeModel, prevJob: any, processor: Processor): Promise<{
        result: string;
        status: -1;
    } | {
        result: {};
        status: 1;
    }>;
}
export {};
