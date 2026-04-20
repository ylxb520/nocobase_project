/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import WorkflowPluginServer, { EventOptions, Trigger, WorkflowModel } from '@nocobase/plugin-workflow';
import { Context, Next } from '@nocobase/actions';
export default class CustomActionTrigger extends Trigger {
    static TYPE: string;
    globalTriggerAction(context: Context, next: Next): Promise<void>;
    triggerAction: (context: Context, next: Next) => Promise<void>;
    constructor(workflow: WorkflowPluginServer);
    private processEvents;
    validateContext(values: any, workflow: WorkflowModel): {
        data: string;
        filterByTk?: undefined;
    } | {
        filterByTk: string;
        data?: undefined;
    };
    execute(workflow: WorkflowModel, values: any, options: EventOptions): Promise<void | import("@nocobase/plugin-workflow").Processor>;
}
