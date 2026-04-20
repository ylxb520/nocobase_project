/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
export class SourceManager {
    sources = new Registry();
    registerSource(name, source) {
        this.sources.register(name, source);
    }
    async sync(ctx, types) {
        const resources = { client: {} };
        const sources = Array.from(this.sources.getKeys());
        const syncSources = sources.filter((source) => types.includes(source));
        const promises = syncSources.map((source) => this.sources.get(source).sync(ctx));
        const results = await Promise.all(promises);
        return results.reduce((result, resource) => {
            return { ...result, ...resource };
        }, resources);
    }
    handleTextsSaved(db, handler) {
        const sources = this.sources;
        for (const source of sources.getValues()) {
            if (!source.collections) {
                continue;
            }
            for (const { collection, fields } of source.collections) {
                db.on(`${collection}.afterSave`, async (instance, options) => {
                    const texts = [];
                    const changedFields = fields.filter((field) => instance['_changed'].has(field));
                    if (!changedFields.length) {
                        return;
                    }
                    changedFields.forEach((field) => {
                        const text = instance.get(field);
                        if (!text) {
                            return;
                        }
                        texts.push({ text, module: `resources.${source.namespace}` });
                    });
                    await handler(texts, options);
                });
            }
        }
    }
}
//# sourceMappingURL=source-manager.js.map