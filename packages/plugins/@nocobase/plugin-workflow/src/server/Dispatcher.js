/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { randomUUID } from 'crypto';
import { Transaction } from 'sequelize';
import { EXECUTION_STATUS } from './constants';
import { WORKER_JOB_WORKFLOW_PROCESS } from './Plugin';
export default class Dispatcher {
    plugin;
    ready = false;
    executing = null;
    pending = [];
    events = [];
    eventsCount = 0;
    get idle() {
        return this.ready && !this.executing && !this.pending.length && !this.events.length;
    }
    constructor(plugin) {
        this.plugin = plugin;
        this.prepare = this.prepare.bind(this);
    }
    onQueueExecution = async (event) => {
        const ExecutionRepo = this.plugin.db.getRepository('executions');
        const execution = await ExecutionRepo.findOne({
            filterByTk: event.executionId,
        });
        if (!execution || execution.dispatched) {
            this.plugin
                .getLogger('dispatcher')
                .info(`execution (${event.executionId}) from queue not found or not in queueing status, skip`);
            return;
        }
        this.plugin
            .getLogger(execution.workflowId)
            .info(`execution (${execution.id}) received from queue, adding to pending list`);
        this.run({ execution });
    };
    setReady(ready) {
        this.ready = ready;
    }
    getEventsCount() {
        return this.eventsCount;
    }
    trigger(workflow, context, options = {}) {
        const logger = this.plugin.getLogger(workflow.id);
        if (!this.ready) {
            logger.warn(`app is not ready, event of workflow ${workflow.id} will be ignored`);
            logger.debug(`ignored event data:`, context);
            return;
        }
        if (!options.force && !options.manually && !workflow.enabled) {
            logger.warn(`workflow ${workflow.id} is not enabled, event will be ignored`);
            return;
        }
        const duplicated = this.events.find(([w, c, { eventKey }]) => {
            if (eventKey && options.eventKey) {
                return eventKey === options.eventKey;
            }
        });
        if (duplicated) {
            logger.warn(`event of workflow ${workflow.id} is duplicated (${options.eventKey}), event will be ignored`);
            return;
        }
        if (context == null) {
            logger.warn(`workflow ${workflow.id} event data context is null, event will be ignored`);
            return;
        }
        if (options.manually || this.plugin.isWorkflowSync(workflow)) {
            return this.triggerSync(workflow, context, options);
        }
        const { transaction, ...rest } = options;
        this.events.push([workflow, context, rest]);
        this.eventsCount = this.events.length;
        logger.info(`new event triggered, now events: ${this.events.length}`);
        logger.debug(`event data:`, { context });
        if (this.events.length > 1) {
            logger.info(`new event is pending to be prepared after previous preparation is finished`);
            return;
        }
        setImmediate(this.prepare);
    }
    async resume(job) {
        let { execution } = job;
        if (!execution) {
            execution = await job.getExecution();
        }
        this.plugin
            .getLogger(execution.workflowId)
            .info(`execution (${execution.id}) resuming from job (${job.id}) added to pending list`);
        this.run({ execution, job, loaded: true });
    }
    async start(execution) {
        if (execution.status) {
            return;
        }
        this.plugin.getLogger(execution.workflowId).info(`starting deferred execution (${execution.id})`);
        this.run({ execution, loaded: true });
    }
    async beforeStop() {
        this.ready = false;
        if (this.events.length) {
            await this.prepare();
        }
        if (this.executing) {
            await this.executing;
        }
    }
    dispatch() {
        if (!this.ready) {
            this.plugin.getLogger('dispatcher').warn(`app is not ready, new dispatching will be ignored`);
            return;
        }
        if (this.executing) {
            this.plugin.getLogger('dispatcher').warn(`workflow executing is not finished, new dispatching will be ignored`);
            return;
        }
        if (this.events.length) {
            return this.prepare();
        }
        this.executing = (async () => {
            let next = null;
            let execution = null;
            if (this.pending.length) {
                const pending = this.pending.shift();
                execution = pending.loaded ? pending.execution : await this.acquirePendingExecution(pending.execution);
                if (execution) {
                    next = [execution, pending.job];
                    this.plugin.getLogger(next[0].workflowId).info(`pending execution (${next[0].id}) ready to process`);
                }
            }
            else {
                if (this.plugin.serving()) {
                    execution = await this.acquireQueueingExecution();
                    if (execution) {
                        next = [execution];
                    }
                }
                else {
                    this.plugin
                        .getLogger('dispatcher')
                        .warn(`${WORKER_JOB_WORKFLOW_PROCESS} is not serving on this instance, new dispatching will be ignored`);
                }
            }
            if (next) {
                await this.process(...next);
            }
            setImmediate(() => {
                this.executing = null;
                if (next || this.pending.length) {
                    this.plugin.getLogger('dispatcher').debug(`last process finished, will do another dispatch`);
                    this.dispatch();
                }
            });
        })();
    }
    async run(pending) {
        this.pending.push(pending);
        this.dispatch();
    }
    async triggerSync(workflow, context, { deferred, ...options } = {}) {
        let execution;
        try {
            execution = await this.createExecution(workflow, context, options);
        }
        catch (err) {
            this.plugin.getLogger(workflow.id).error(`creating execution failed: ${err.message}`, err);
            return null;
        }
        try {
            return this.process(execution, null, options);
        }
        catch (err) {
            this.plugin.getLogger(execution.workflowId).error(`execution (${execution.id}) error: ${err.message}`, err);
        }
        return null;
    }
    async validateEvent(workflow, context, options) {
        const trigger = this.plugin.triggers.get(workflow.type);
        const triggerValid = await trigger.validateEvent(workflow, context, options);
        if (!triggerValid) {
            return false;
        }
        const { stack } = options;
        let valid = true;
        if (stack?.length > 0) {
            const existed = await workflow.countExecutions({
                where: {
                    id: stack,
                },
                transaction: options.transaction,
            });
            const limitCount = workflow.options.stackLimit || 1;
            if (existed >= limitCount) {
                this.plugin
                    .getLogger(workflow.id)
                    .warn(`workflow ${workflow.id} has already been triggered in stacks executions (${stack}), and max call coont is ${limitCount}, newly triggering will be skipped.`);
                valid = false;
            }
        }
        return valid;
    }
    async createExecution(workflow, context, options) {
        const { deferred } = options;
        const transaction = await this.plugin.useDataSourceTransaction('main', options.transaction, true);
        const sameTransaction = options.transaction === transaction;
        const valid = await this.validateEvent(workflow, context, { ...options, transaction });
        if (!valid) {
            if (!sameTransaction) {
                await transaction.commit();
            }
            options.onTriggerFail?.(workflow, context, options);
            return Promise.reject(new Error('event is not valid'));
        }
        let execution;
        try {
            execution = await workflow.createExecution({
                context,
                key: workflow.key,
                eventKey: options.eventKey ?? randomUUID(),
                stack: options.stack,
                dispatched: deferred ?? false,
                status: deferred ? EXECUTION_STATUS.STARTED : EXECUTION_STATUS.QUEUEING,
                manually: options.manually,
            }, { transaction });
        }
        catch (err) {
            if (!sameTransaction) {
                await transaction.rollback();
            }
            throw err;
        }
        this.plugin.getLogger(workflow.id).info(`execution of workflow ${workflow.id} created as ${execution.id}`);
        if (!workflow.stats) {
            workflow.stats = await workflow.getStats({ transaction });
        }
        await workflow.stats.increment('executed', { transaction });
        // NOTE: https://sequelize.org/api/v6/class/src/model.js~model#instance-method-increment
        if (this.plugin.db.options.dialect !== 'postgres') {
            await workflow.stats.reload({ transaction });
        }
        if (!workflow.versionStats) {
            workflow.versionStats = await workflow.getVersionStats({ transaction });
        }
        await workflow.versionStats.increment('executed', { transaction });
        if (this.plugin.db.options.dialect !== 'postgres') {
            await workflow.versionStats.reload({ transaction });
        }
        if (!sameTransaction) {
            await transaction.commit();
        }
        execution.workflow = workflow;
        return execution;
    }
    prepare = async () => {
        if (this.executing && this.plugin.db.options.dialect === 'sqlite') {
            await this.executing;
        }
        const event = this.events.shift();
        this.eventsCount = this.events.length;
        if (!event) {
            this.plugin.getLogger('dispatcher').info(`events queue is empty, no need to prepare`);
            return;
        }
        const logger = this.plugin.getLogger(event[0].id);
        logger.info(`preparing execution for event`);
        try {
            const execution = await this.createExecution(...event);
            // NOTE: cache first execution for most cases
            if (!execution?.dispatched) {
                if (this.plugin.serving() && !this.executing && !this.pending.length) {
                    logger.info(`local pending list is empty, adding execution (${execution.id}) to pending list`);
                    this.pending.push({ execution });
                }
                else {
                    logger.info(`instance is not serving as worker or local pending list is not empty, sending execution (${execution.id}) to queue`);
                    try {
                        await this.plugin.app.eventQueue.publish(this.plugin.channelPendingExecution, {
                            executionId: execution.id,
                        });
                    }
                    catch (qErr) {
                        logger.error(`publishing execution (${execution.id}) to queue failed:`, { error: qErr });
                    }
                }
            }
        }
        catch (error) {
            logger.error(`failed to create execution:`, { error });
        }
        if (this.events.length) {
            await this.prepare();
        }
        else {
            this.plugin.getLogger('dispatcher').info('no more events need to be prepared, dispatching...');
            if (this.executing) {
                await this.executing;
            }
            this.dispatch();
        }
    };
    async acquirePendingExecution(execution) {
        const logger = this.plugin.getLogger(execution.workflowId);
        const isolationLevel = this.plugin.db.options.dialect === 'sqlite' ? [][0] : Transaction.ISOLATION_LEVELS.REPEATABLE_READ;
        let fetched = execution;
        try {
            await this.plugin.db.sequelize.transaction({ isolationLevel }, async (transaction) => {
                const ExecutionModelClass = this.plugin.db.getModel('executions');
                const [affected] = await ExecutionModelClass.update({ dispatched: true, status: EXECUTION_STATUS.STARTED }, {
                    where: {
                        id: execution.id,
                        dispatched: false,
                    },
                    transaction,
                });
                if (!affected) {
                    fetched = null;
                    return;
                }
                await execution.reload({ transaction });
            });
        }
        catch (error) {
            logger.error(`acquiring pending execution failed: ${error.message}`, { error });
        }
        return fetched;
    }
    async acquireQueueingExecution() {
        const isolationLevel = this.plugin.db.options.dialect === 'sqlite' ? [][0] : Transaction.ISOLATION_LEVELS.REPEATABLE_READ;
        let fetched = null;
        try {
            await this.plugin.db.sequelize.transaction({
                isolationLevel,
            }, async (transaction) => {
                const execution = (await this.plugin.db.getRepository('executions').findOne({
                    filter: {
                        dispatched: false,
                        'workflow.enabled': true,
                    },
                    sort: 'id',
                    transaction,
                }));
                if (execution) {
                    this.plugin.getLogger(execution.workflowId).info(`execution (${execution.id}) fetched from db`);
                    await execution.update({
                        dispatched: true,
                        status: EXECUTION_STATUS.STARTED,
                    }, { transaction });
                    execution.workflow = this.plugin.enabledCache.get(execution.workflowId);
                    fetched = execution;
                }
                else {
                    this.plugin.getLogger('dispatcher').debug(`no execution in db queued to process`);
                }
            });
        }
        catch (error) {
            this.plugin.getLogger('dispatcher').error(`fetching execution from db failed: ${error.message}`, { error });
        }
        return fetched;
    }
    async process(execution, job, options = {}) {
        const logger = this.plugin.getLogger(execution.workflowId);
        if (!execution.dispatched) {
            const transaction = await this.plugin.useDataSourceTransaction('main', options.transaction);
            await execution.update({ dispatched: true, status: EXECUTION_STATUS.STARTED }, { transaction });
            logger.info(`execution (${execution.id}) from pending list updated to started`);
        }
        const processor = this.plugin.createProcessor(execution, options);
        logger.info(`execution (${execution.id}) ${job ? 'resuming' : 'starting'}...`);
        try {
            await (job ? processor.resume(job) : processor.start());
            logger.info(`execution (${execution.id}) finished with status: ${execution.status}`);
            logger.debug(`execution (${execution.id}) details:`, { execution });
            if (execution.status && execution.workflow.options?.deleteExecutionOnStatus?.includes(execution.status)) {
                await execution.destroy({ transaction: processor.mainTransaction });
            }
        }
        catch (err) {
            logger.error(`execution (${execution.id}) error: ${err.message}`, err);
        }
        return processor;
    }
}
//# sourceMappingURL=Dispatcher.js.map