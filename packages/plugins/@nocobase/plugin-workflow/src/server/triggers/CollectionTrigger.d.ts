/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
import Trigger from '.';
import type { WorkflowModel } from '../types';
import type { EventOptions } from '../Dispatcher';
import PluginWorkflowServer from '../Plugin';
export interface CollectionChangeTriggerConfig {
    collection: string;
    mode: number;
    condition: any;
}
export default class CollectionTrigger extends Trigger {
    readonly workflow: PluginWorkflowServer;
    events: Map<any, any>;
    constructor(workflow: PluginWorkflowServer);
    private static handler;
    prepare(workflow: WorkflowModel, data: Model | Record<string, any> | string | number, options: any): Promise<{
        data: any;
    }>;
    on(workflow: WorkflowModel): void;
    off(workflow: WorkflowModel): void;
    execute(workflow: WorkflowModel, values: any, options: EventOptions): Promise<void | import("..").Processor>;
    validateContext(values: any): {
        data: string;
    };
}
