/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export default class Resources {
    cache;
    db;
    constructor(db, cache) {
        this.cache = cache;
        this.db = db;
    }
    async getTexts(transaction) {
        if (!(await this.db.collectionExistsInDb('localizationTexts'))) {
            return [];
        }
        return await this.cache.wrap(`texts`, async () => {
            return await this.db.getRepository('localizationTexts').find({
                fields: ['id', 'module', 'text'],
                raw: true,
                transaction,
            });
        });
    }
    async getTranslations(locale) {
        if (!(await this.db.collectionExistsInDb('localizationTranslations'))) {
            return [];
        }
        return await this.cache.wrap(`translations:${locale}`, async () => {
            return await this.db.getRepository('localizationTranslations').find({
                fields: ['textId', 'translation'],
                filter: { locale },
                raw: true,
            });
        });
    }
    async getResources(locale) {
        const [texts, translations] = await Promise.all([this.getTexts(), this.getTranslations(locale)]);
        const resources = {};
        const textsMap = texts.reduce((map, item) => {
            map[item.id] = item;
            return map;
        }, {});
        translations.forEach((item) => {
            const text = textsMap[item.textId];
            if (!text) {
                return;
            }
            const module = text.module;
            if (!resources[module]) {
                resources[module] = {};
            }
            resources[module][text.text] = item.translation;
        });
        return resources;
    }
    async filterExists(texts, transaction) {
        const existTexts = await this.getTexts(transaction);
        return texts.filter((text) => {
            return !existTexts.find((item) => item.text === text.text && item.module === text.module);
        });
    }
    async updateCacheTexts(texts, transaction) {
        const newTexts = texts.map((text) => ({
            id: text.id,
            module: text.module,
            text: text.text,
        }));
        const existTexts = await this.getTexts(transaction);
        await this.cache.set(`texts`, [...existTexts, ...newTexts]);
    }
    async reset() {
        await this.cache.reset();
    }
}
//# sourceMappingURL=resources.js.map