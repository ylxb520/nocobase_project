/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { hooks } from './hooks';
export class ServerHooks {
    db;
    hooks = new Map();
    constructor(db) {
        this.db = db;
        this.listen();
        this.registerHooks();
    }
    registerHooks() {
        hooks.forEach((hook) => this.register(hook.hookType, hook.hookName, hook.hookFunc));
    }
    listen() {
        this.db.on('fields.afterDestroy', async (model, options) => {
            await this.onCollectionFieldDestroy(model, options);
            await this.onAnyCollectionFieldDestroy(model, options);
        });
        this.db.on('collections.afterDestroy', async (model, options) => {
            await this.onCollectionDestroy(model, options);
        });
        this.db.on('uiSchemas.afterCreateWithAssociations', async (model, options) => {
            await this.onUiSchemaCreate(model, options);
        });
        this.db.on('uiSchemaMove', async (model, options) => {
            await this.onUiSchemaMove(model, options);
        });
        this.db.on('uiSchemas.afterSave', async (model, options) => {
            await this.onUiSchemaSave(model, options);
        });
    }
    async callSchemaInstanceHooksByType(schemaInstance, options, type) {
        const { transaction } = options;
        const hooks = schemaInstance.getServerHooksByType(type);
        for (const hook of hooks) {
            const hookFunc = this.hooks.get(type)?.get(hook['method']);
            await hookFunc?.({
                schemaInstance,
                options,
                db: this.db,
                params: hook['params'],
            });
        }
    }
    async onUiSchemaMove(schemaInstance, options) {
        await this.callSchemaInstanceHooksByType(schemaInstance, options, 'onSelfMove');
    }
    async onCollectionDestroy(collectionModel, options) {
        const { transaction } = options;
        await this.findHooksAndCall({
            type: 'onCollectionDestroy',
            collection: collectionModel.get('name'),
        }, {
            collectionInstance: collectionModel,
            options,
        }, transaction);
    }
    async onAnyCollectionFieldDestroy(fieldModel, options) {
        const { transaction } = options;
        const collectionName = fieldModel.get('collectionName');
        await this.findHooksAndCall({
            type: 'onAnyCollectionFieldDestroy',
            collection: collectionName,
        }, {
            collectionFieldInstance: fieldModel,
            options,
        }, transaction);
    }
    async onCollectionFieldDestroy(fieldModel, options) {
        const { transaction } = options;
        const collectionName = fieldModel.get('collectionName');
        const fieldName = fieldModel.get('name');
        await this.findHooksAndCall({
            type: 'onCollectionFieldDestroy',
            collection: collectionName,
            field: fieldName,
        }, {
            collectionFieldInstance: fieldModel,
            options,
        }, transaction);
    }
    async onUiSchemaCreate(schemaInstance, options) {
        await this.callSchemaInstanceHooksByType(schemaInstance, options, 'onSelfCreate');
    }
    async onUiSchemaSave(schemaInstance, options) {
        await this.callSchemaInstanceHooksByType(schemaInstance, options, 'onSelfSave');
    }
    async findHooksAndCall(hooksFilter, hooksArgs, transaction) {
        const hooks = (await this.db.getRepository('uiSchemaServerHooks').find({
            filter: hooksFilter,
            appends: ['uiSchema'],
            transaction,
        }));
        for (const hookRecord of hooks) {
            const hoodMethodName = hookRecord.get('method');
            const hookFunc = this.hooks.get(hookRecord.get('type'))?.get(hoodMethodName);
            if (hookFunc) {
                await hookFunc({
                    ...hooksArgs,
                    schemaInstance: hookRecord.uiSchema,
                    db: this.db,
                    params: hookRecord.get('params'),
                });
            }
        }
    }
    /**
     * register a server hook function
     * @param type type of server hook
     * @param name name of server hook
     * @param hookFunc server hook function
     */
    register(type, name, hookFunc) {
        if (!this.hooks.has(type)) {
            this.hooks.set(type, new Map());
        }
        const hookTypeMap = this.hooks.get(type);
        hookTypeMap.set(name, hookFunc);
    }
    remove(type, name) {
        if (!this.hooks.has(type)) {
            return;
        }
        const hookTypeMap = this.hooks.get(type);
        hookTypeMap.delete(name);
    }
}
//# sourceMappingURL=index.js.map