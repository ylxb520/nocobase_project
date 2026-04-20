/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { Instruction, Processor, FlowNodeModel } from '@nocobase/plugin-workflow';
export default class extends Instruction {
    run(node: FlowNodeModel, prevJob: any, processor: Processor): Promise<{
        status: 1;
        result: any;
    }>;
}
