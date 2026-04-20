/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry, lodash } from '@nocobase/utils';
import { getResource } from './resource';
import { OFFICIAL_PLUGIN_PREFIX } from '..';
import deepmerge from 'deepmerge';
export class Locale {
    app;
    cache;
    defaultLang = 'en-US';
    localeFn = new Map();
    resourceCached = new Map();
    i18nInstances = new Map();
    resourceStorers = new Registry();
    constructor(app) {
        this.app = app;
        this.app.on('afterLoad', async () => {
            this.app.log.debug('loading locale resource...', { submodule: 'locale', method: 'onAfterLoad' });
            this.app.setMaintainingMessage('load locale resource');
            await this.load();
            this.app.log.debug('locale resource loaded', { submodule: 'locale', method: 'onAfterLoad' });
            this.app.setMaintainingMessage('locale resource loaded');
        });
        this.app.syncMessageManager.subscribe('localeManager', async (message) => {
            switch (message.type) {
                case 'reload':
                    await this.reset();
                    return;
            }
        });
    }
    async load() {
        this.cache = await this.app.cacheManager.createCache({
            name: 'locale',
            prefix: 'locale',
            store: 'memory',
        });
        await this.get(this.defaultLang);
    }
    async reset() {
        const storers = Array.from(this.resourceStorers.getValues());
        const promises = storers.map((storer) => storer.reset());
        await Promise.all([this.cache.reset(), ...promises]);
    }
    async reload() {
        await this.reset();
        this.app.syncMessageManager.publish('localeManager', { type: 'reload' });
    }
    setLocaleFn(name, fn) {
        this.localeFn.set(name, fn);
    }
    registerResourceStorer(name, storer) {
        this.resourceStorers.register(name, storer);
    }
    async get(lang) {
        const defaults = {
            resources: await this.getCacheResources(lang),
        };
        for (const [name, fn] of this.localeFn) {
            // this.app.log.debug(`load [${name}] locale resource `);
            const result = await this.wrapCache(`${name}:${lang}`, async () => await fn(lang));
            if (result) {
                defaults[name] = result;
            }
        }
        return defaults;
    }
    async wrapCache(key, fn) {
        return await this.cache.wrapWithCondition(key, fn, {
            isCacheable: (val) => !lodash.isEmpty(val),
        });
    }
    async loadResourcesByLang(lang) {
        if (!this.cache) {
            return;
        }
        if (!this.resourceCached.has(lang)) {
            await this.getCacheResources(lang);
        }
    }
    async getCacheResources(lang) {
        this.resourceCached.set(lang, true);
        if (process.env.APP_ENV !== 'production') {
            await this.reload();
        }
        return await this.wrapCache(`resources:${lang}`, () => this.getResources(lang));
    }
    async getResources(lang) {
        const resources = {};
        const names = this.app.pm.getPlugins().keys();
        for (const name of names) {
            try {
                const p = this.app.pm.get(name);
                if (!p) {
                    continue;
                }
                const packageName = p.options?.packageName;
                if (!packageName) {
                    continue;
                }
                // this.app.log.debug(`load [${packageName}] locale resource `);
                // this.app.setMaintainingMessage(`load [${packageName}] locale resource `);
                const res = await getResource(packageName, lang);
                if (res) {
                    resources[packageName] = { ...res };
                    if (packageName.includes(OFFICIAL_PLUGIN_PREFIX)) {
                        resources[packageName.substring(OFFICIAL_PLUGIN_PREFIX.length)] = { ...res };
                    }
                }
            }
            catch (err) {
                // empty
            }
        }
        // handle custom resources
        const storers = this.resourceStorers.getValues();
        for (const storer of storers) {
            const custom = await storer.getResources(lang);
            Object.keys(custom).forEach((key) => {
                const module = key.replace('resources.', '');
                const resource = resources[module];
                const customResource = custom[key];
                resources[module] = resource ? deepmerge(resource, customResource) : customResource;
                const pkgName = `${OFFICIAL_PLUGIN_PREFIX}${module}`;
                if (resources[pkgName]) {
                    resources[pkgName] = { ...resources[module] };
                }
            });
        }
        Object.keys(resources).forEach((name) => {
            this.app.i18n.addResources(lang, name, resources[name]);
        });
        return resources;
    }
    async getI18nInstance(lang) {
        if (lang === '*' || !lang) {
            return this.app.i18n.cloneInstance({ initImmediate: false });
        }
        let instance = this.i18nInstances.get(lang);
        if (!instance) {
            instance = this.app.i18n.cloneInstance({ initImmediate: false });
            this.i18nInstances.set(lang, instance);
        }
        return instance;
    }
}
//# sourceMappingURL=locale.js.map