/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { EventOptions, Trigger, WorkflowModel } from '@nocobase/plugin-workflow';
export default class RequestInterceptionTrigger extends Trigger {
    static TYPE: string;
    sync: boolean;
    middleware: (context: any, next: any) => Promise<any>;
    constructor(workflow: any);
    validateContext(values: any): {
        target: string;
        userId?: undefined;
    } | {
        userId: string;
        target?: undefined;
    };
    execute(workflow: WorkflowModel, values: any, options: EventOptions): Promise<void | import("@nocobase/plugin-workflow").Processor>;
}
