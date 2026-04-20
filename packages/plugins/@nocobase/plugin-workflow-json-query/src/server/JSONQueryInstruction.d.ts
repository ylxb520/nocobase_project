/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
import { Instruction, Processor, FlowNodeModel } from '@nocobase/plugin-workflow';
type JSONQueryEngine = (expression: string, scope: any) => any;
export default class extends Instruction {
    engines: Registry<JSONQueryEngine>;
    constructor(workflow: any);
    execute({ engine, expression, model, source }: {
        engine?: string;
        expression: any;
        model: any;
        source: any;
    }): Promise<{
        result: any;
        status: 1;
    } | {
        result: any;
        status: -2;
    }>;
    run(node: FlowNodeModel, prevJob: any, processor: Processor): Promise<{
        result: any;
        status: 1;
    } | {
        result: any;
        status: -2;
    }>;
    test(config: any): Promise<{
        result: any;
        status: 1;
    } | {
        result: any;
        status: -2;
    }>;
}
export {};
