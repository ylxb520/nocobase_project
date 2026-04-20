/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Processor, Instruction, FlowNodeModel } from '@nocobase/plugin-workflow';
import { Registry } from '@nocobase/utils';
export default class extends Instruction {
    functions: Registry<Function>;
    constructor(workflow: any);
    calculate({ steps, input, inputType }: {
        steps?: any[];
        input?: Date;
        inputType?: string;
    }): {
        result: any;
        status: -2;
    } | {
        result: number | Date;
        status: 1;
    };
    run(node: FlowNodeModel, _: any, processor: Processor): Promise<{
        result: any;
        status: -2;
    } | {
        result: number | Date;
        status: 1;
    }>;
    test({ steps, input, inputType }: {
        steps?: any[];
        input?: Date;
        inputType?: string;
    }): Promise<{
        result: any;
        status: -2;
    } | {
        result: number | Date;
        status: 1;
    }>;
}
