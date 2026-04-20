/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Snowflake } from 'nodejs-snowflake';
import { Transactionable } from 'sequelize';
import { Plugin } from '@nocobase/server';
import { Registry } from '@nocobase/utils';
import { Logger } from '@nocobase/logger';
import Dispatcher, { EventOptions } from './Dispatcher';
import Processor from './Processor';
import { CustomFunction } from './functions';
import Trigger from './triggers';
import { InstructionInterface } from './instructions';
import type { ExecutionModel, WorkflowModel } from './types';
type ID = number | string;
export declare const WORKER_JOB_WORKFLOW_PROCESS = "workflow:process";
export default class PluginWorkflowServer extends Plugin {
    instructions: Registry<InstructionInterface>;
    triggers: Registry<Trigger>;
    functions: Registry<CustomFunction>;
    enabledCache: Map<number, WorkflowModel>;
    snowflake: Snowflake;
    private dispatcher;
    get channelPendingExecution(): string;
    private loggerCache;
    private meter;
    private checker;
    private onBeforeSave;
    private onAfterCreate;
    private onAfterUpdate;
    private onAfterDestroy;
    private onAfterStart;
    private onBeforeStop;
    handleSyncMessage(message: any): Promise<void>;
    serving(): boolean;
    /**
     * @experimental
     */
    getLogger(workflowId?: ID): Logger;
    /**
     * @experimental
     * @param {WorkflowModel} workflow
     * @returns {boolean}
     */
    isWorkflowSync(workflow: WorkflowModel): boolean;
    registerTrigger<T extends Trigger>(type: string, trigger: T | {
        new (p: Plugin): T;
    }): void;
    registerInstruction(type: string, instruction: InstructionInterface | {
        new (p: Plugin): InstructionInterface;
    }): void;
    private initTriggers;
    private initInstructions;
    beforeLoad(): Promise<void>;
    /**
     * @internal
     */
    load(): Promise<void>;
    private toggle;
    trigger(workflow: WorkflowModel, context: object, options?: EventOptions): void | Promise<Processor | null>;
    run(pending: Parameters<Dispatcher['run']>[0]): Promise<void>;
    resume(job: any): Promise<void>;
    /**
     * Start a deferred execution
     * @experimental
     */
    start(execution: ExecutionModel): Promise<void>;
    createProcessor(execution: ExecutionModel, options?: {}): Processor;
    execute(workflow: WorkflowModel, values: any, options?: EventOptions): Promise<void | Processor>;
    /**
     * @experimental
     * @param {string} dataSourceName
     * @param {Transaction} transaction
     * @param {boolean} create
     * @returns {Trasaction}
     */
    useDataSourceTransaction(dataSourceName: string, transaction: any, create?: boolean): any;
    /**
     * @experimental
     */
    updateTasksStats(userId: number, type: string, stats: {
        pending: number;
        all: number;
    }, { transaction }: Transactionable): Promise<void>;
}
export {};
