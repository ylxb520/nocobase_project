/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
export class SyncSourceManager {
    syncSourceTypes = new Registry();
    registerType(syncSourceType, syncSourceConfig) {
        this.syncSourceTypes.register(syncSourceType, syncSourceConfig);
    }
    listTypes() {
        return Array.from(this.syncSourceTypes.getEntities()).map(([syncSourceType, source]) => ({
            name: syncSourceType,
            title: source.title,
        }));
    }
    async getByName(name, ctx) {
        const repo = ctx.db.getRepository('userDataSyncSources');
        const sourceInstance = await repo.findOne({ filter: { enabled: true, name: name } });
        if (!sourceInstance) {
            throw new Error(`SyncSource [${name}] is not found.`);
        }
        return this.create(sourceInstance, ctx);
    }
    async getById(id, ctx) {
        const repo = ctx.db.getRepository('userDataSyncSources');
        const sourceInstance = await repo.findOne({ filter: { enabled: true }, filterByTk: id });
        if (!sourceInstance) {
            throw new Error(`SyncSource [${id}] is not found.`);
        }
        return this.create(sourceInstance, ctx);
    }
    create(sourceInstance, ctx) {
        const { syncSource } = this.syncSourceTypes.get(sourceInstance.sourceType) || {};
        if (!syncSource) {
            throw new Error(`SyncSourceType [${sourceInstance.sourceType}] is not found.`);
        }
        return new syncSource({ sourceInstance: sourceInstance, options: sourceInstance.options, ctx });
    }
}
//# sourceMappingURL=sync-source-manager.js.map