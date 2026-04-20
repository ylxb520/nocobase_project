/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { pick } from 'lodash';
import { isValidFilter } from '@nocobase/utils';
import { Model } from '@nocobase/database';
import { parseCollectionName, } from '@nocobase/data-source-manager';
import Trigger from '.';
import { toJSON } from '../utils';
const MODE_BITMAP = {
    CREATE: 1,
    UPDATE: 2,
    DESTROY: 4,
};
const MODE_BITMAP_EVENTS = new Map();
MODE_BITMAP_EVENTS.set(MODE_BITMAP.CREATE, 'afterCreateWithAssociations');
MODE_BITMAP_EVENTS.set(MODE_BITMAP.UPDATE, 'afterUpdateWithAssociations');
MODE_BITMAP_EVENTS.set(MODE_BITMAP.DESTROY, 'afterDestroy');
function getHookId(workflow, type) {
    return `${type}#${workflow.id}`;
}
function getFieldRawName(collection, name) {
    const field = collection.getField(name);
    if (field && field.options.type === 'belongsTo') {
        return field.options.foreignKey;
    }
    return name;
}
export default class CollectionTrigger extends Trigger {
    workflow;
    events = new Map();
    constructor(workflow) {
        super(workflow);
        this.workflow = workflow;
        this.workflow.app.dataSourceManager.afterAddDataSource((dataSource) => {
            for (const item of this.workflow.enabledCache.values()) {
                if (item.type !== 'collection' || !item.config.collection) {
                    continue;
                }
                const [dataSourceName] = parseCollectionName(item.config.collection);
                if (dataSource.name === dataSourceName) {
                    this.off(item);
                    this.on(item);
                }
            }
        });
    }
    // async function, should return promise
    static async handler(workflowId, eventType, data, options) {
        const workflow = this.workflow.enabledCache.get(workflowId);
        const { skipWorkflow = false, stack } = options.context ?? {};
        if (skipWorkflow) {
            return;
        }
        const [dataSourceName] = parseCollectionName(workflow.config.collection);
        const transaction = this.workflow.useDataSourceTransaction(dataSourceName, options.transaction);
        const ctx = await this.prepare(workflow, data, { ...options, transaction, eventType });
        if (!ctx) {
            return;
        }
        if (workflow.sync) {
            await this.workflow.trigger(workflow, ctx, {
                transaction,
                stack,
            });
        }
        else {
            if (transaction) {
                transaction.afterCommit(() => {
                    this.workflow.trigger(workflow, ctx, { stack });
                });
            }
            else {
                this.workflow.trigger(workflow, ctx, { stack });
            }
        }
    }
    async prepare(workflow, data, options) {
        const { condition, changed, mode, appends } = workflow.config;
        const [dataSourceName, collectionName] = parseCollectionName(workflow.config.collection);
        const { collectionManager } = this.workflow.app.dataSourceManager.dataSources.get(dataSourceName);
        const collection = collectionManager.getCollection(collectionName);
        const { transaction, context, eventType } = options;
        const { repository, filterTargetKey } = collection;
        let target = data;
        let filterByTk;
        let loadNeeded = false;
        if (target && typeof target === 'object') {
            filterByTk = Array.isArray(filterTargetKey)
                ? pick(target, filterTargetKey.sort((a, b) => a.localeCompare(b)))
                : target[filterTargetKey];
        }
        else {
            filterByTk = target;
            loadNeeded = true;
        }
        // NOTE: if no configured fields changed, do not trigger
        // Modified: also check for association field changes (belongsToMany, hasMany, etc.)
        if (eventType === MODE_BITMAP_EVENTS.get(MODE_BITMAP.UPDATE) &&
            target instanceof Model &&
            changed &&
            changed.length) {
            // Check if any non-association field changed
            const nonAssociationChanged = changed
                .filter((name) => {
                const field = collection.getField(name);
                return field && !['linkTo', 'hasOne', 'hasMany', 'belongsToMany'].includes(field.options.type);
            })
                .some((name) => target.changedWithAssociations(getFieldRawName(collection, name)));
            // Check if any association field changed
            const associationChanged = changed
                .filter((name) => {
                const field = collection.getField(name);
                return field && ['linkTo', 'hasOne', 'hasMany', 'belongsToMany'].includes(field.options.type);
            })
                .some((name) => {
                // For association fields, check if the model has been modified
                const field = collection.getField(name);
                if (!field)
                    return false;
                // Check if this association was touched/modified
                return target.changedWithAssociations?.(name) ||
                    target._previousDataValues?.[name] !== undefined;
            });
            // If nothing changed, skip triggering
            if (!nonAssociationChanged && !associationChanged) {
                return null;
            }
        }
        // NOTE: if no configured condition, or not match, do not trigger
        if (isValidFilter(condition) && !(mode & MODE_BITMAP.DESTROY)) {
            // TODO: change to map filter format to calculation format
            // const calculation = toCalculation(condition);
            const count = await repository.count({
                filterByTk,
                filter: condition,
                context,
                transaction,
            });
            if (!count) {
                return null;
            }
        }
        if (loadNeeded || (appends?.length && !(mode & MODE_BITMAP.DESTROY))) {
            const includeFields = appends.reduce((set, field) => {
                set.add(field.split('.')[0]);
                set.add(field);
                return set;
            }, new Set());
            target = await repository.findOne({
                filterByTk,
                appends: Array.from(includeFields),
                transaction,
            });
        }
        return {
            data: toJSON(target),
        };
    }
    on(workflow) {
        const { collection, mode } = workflow.config;
        if (!collection) {
            return;
        }
        const [dataSourceName, collectionName] = parseCollectionName(collection);
        const dataSource = this.workflow.app.dataSourceManager?.dataSources.get(dataSourceName);
        if (!dataSource) {
            this.workflow.getLogger().warn(`[CollectionTrigger] data source not exists: ${dataSourceName}`);
            return;
        }
        const { db } = dataSource.collectionManager;
        if (!db || !db.getCollection(collectionName)) {
            this.workflow.getLogger().warn(`[CollectionTrigger] collection not exists: ${dataSourceName}`);
            return;
        }
        for (const [key, type] of MODE_BITMAP_EVENTS.entries()) {
            const event = `${collectionName}.${type}`;
            const name = getHookId(workflow, `${collection}.${type}`);
            if (mode & key) {
                if (!this.events.has(name)) {
                    const listener = this.constructor.handler.bind(this, workflow.id, type);
                    this.events.set(name, listener);
                    db.on(event, listener);
                }
            }
            else {
                const listener = this.events.get(name);
                if (listener) {
                    db.off(event, listener);
                    this.events.delete(name);
                }
            }
        }
    }
    off(workflow) {
        const { collection, mode } = workflow.config;
        if (!collection) {
            return;
        }
        const [dataSourceName, collectionName] = parseCollectionName(collection);
        const dataSource = this.workflow.app.dataSourceManager?.dataSources.get(dataSourceName);
        if (!dataSource) {
            this.workflow.getLogger().warn(`[CollectionTrigger] data source not exists: ${dataSourceName}`);
            return;
        }
        const { db } = dataSource.collectionManager;
        if (!db || !db.getCollection(collectionName)) {
            this.workflow.getLogger().warn(`[CollectionTrigger] collection not exists: ${dataSourceName}`);
            return;
        }
        for (const [key, type] of MODE_BITMAP_EVENTS.entries()) {
            const name = getHookId(workflow, `${collection}.${type}`);
            if (mode & key) {
                const listener = this.events.get(name);
                if (listener) {
                    db.off(`${collectionName}.${type}`, listener);
                    this.events.delete(name);
                }
            }
        }
    }
    // async validateEvent(workflow: WorkflowModel, context: any, options: Transactionable): Promise<boolean> {
    //   if (context.stack) {
    //     const existed = await workflow.countExecutions({
    //       where: {
    //         id: context.stack,
    //       },
    //       transaction: options.transaction,
    //     });
    //     if (existed) {
    //       this.workflow
    //         .getLogger(workflow.id)
    //         .warn(
    //           `workflow ${workflow.id} has already been triggered in stack executions (${context.stack}), and newly triggering will be skipped.`,
    //         );
    //       return false;
    //     }
    //   }
    //   return true;
    // }
    async execute(workflow, values, options) {
        const ctx = await this.prepare(workflow, values?.data, options);
        const [dataSourceName] = parseCollectionName(workflow.config.collection);
        const { transaction } = options;
        return this.workflow.trigger(workflow, ctx, {
            ...options,
            transaction: this.workflow.useDataSourceTransaction(dataSourceName, transaction),
        });
    }
    validateContext(values) {
        if (!values.data) {
            return {
                data: 'Data is required',
            };
        }
        return null;
    }
}
//# sourceMappingURL=CollectionTrigger.js.map