/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Transactionable } from 'sequelize';
import type { QueueEventOptions } from '@nocobase/server';
import Processor from './Processor';
import type { ExecutionModel, JobModel, WorkflowModel } from './types';
import type PluginWorkflowServer from './Plugin';
type Pending = {
    execution: ExecutionModel;
    job?: JobModel;
    loaded?: boolean;
};
export type EventOptions = {
    eventKey?: string;
    context?: any;
    deferred?: boolean;
    manually?: boolean;
    force?: boolean;
    stack?: Array<number | string>;
    onTriggerFail?: Function;
    [key: string]: any;
} & Transactionable;
export default class Dispatcher {
    private readonly plugin;
    private ready;
    private executing;
    private pending;
    private events;
    private eventsCount;
    get idle(): boolean;
    constructor(plugin: PluginWorkflowServer);
    readonly onQueueExecution: QueueEventOptions['process'];
    setReady(ready: boolean): void;
    getEventsCount(): number;
    trigger(workflow: WorkflowModel, context: object, options?: EventOptions): void | Promise<Processor | null>;
    resume(job: any): Promise<void>;
    start(execution: ExecutionModel): Promise<void>;
    beforeStop(): Promise<void>;
    dispatch(): Promise<void>;
    run(pending: Pending): Promise<void>;
    private triggerSync;
    private validateEvent;
    private createExecution;
    private prepare;
    private acquirePendingExecution;
    private acquireQueueingExecution;
    private process;
}
export {};
