/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Logger } from 'winston';
import { Processor, Instruction, FlowNodeModel } from '@nocobase/plugin-workflow';
type ScriptConfig = {
    content?: string;
    timeout?: number;
    continue?: boolean;
    arguments?: {
        [key: string]: any;
    }[];
};
export default class ScriptInstruction extends Instruction {
    static run(source: any, args: any, options: {
        logger: Logger;
        timeout?: number;
    }): Promise<{
        status: -2;
        result: any;
    } | {
        status: 1;
        result: any;
    }>;
    run(node: FlowNodeModel, prevJob: any, processor: Processor): Promise<{
        result: any;
        status: 1 | -2;
    }>;
    resume(node: FlowNodeModel, job: any, processor: Processor): Promise<any>;
    test(config?: ScriptConfig): Promise<{
        log: string;
        status: -2;
        result: any;
    } | {
        log: string;
        status: 1;
        result: any;
    }>;
}
export {};
