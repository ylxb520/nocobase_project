/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@nocobase/actions';
import { Op } from '@nocobase/database';
const appendTranslations = async (db, rows, locale) => {
    const texts = rows || [];
    const textIds = texts.map((text) => text.id);
    const textMp = texts.reduce((memo, text) => {
        memo[text.id] = text;
        return memo;
    }, {});
    const repo = db.getRepository('localizationTranslations');
    const translations = await repo.find({
        filter: {
            locale,
            textId: textIds,
        },
    });
    translations.forEach((translation) => {
        const text = textMp[translation.textId];
        if (text) {
            text.set('translation', translation.translation, { raw: true });
            text.set('translationId', translation.id, { raw: true });
            textMp[translation.textId] = text;
        }
    });
    return Object.values(textMp);
};
const listText = async (db, params) => {
    const { module, keyword, hasTranslation, locale, options } = params;
    if (module) {
        options['filter'] = { module: `resources.${module}` };
    }
    if (keyword || !hasTranslation) {
        options['include'] = [{ association: 'translations', where: { locale }, required: false }];
        if (!hasTranslation) {
            if (keyword) {
                options['filter'] = {
                    ...options['filter'],
                    text: {
                        $includes: keyword,
                    },
                };
            }
            options['where'] = {
                '$translations.id$': null,
            };
        }
        else {
            options['where'] = {
                [Op.or]: [
                    { text: { [Op.like]: `%${keyword}%` } },
                    { '$translations.translation$': { [Op.like]: `%${keyword}%` } },
                ],
            };
        }
    }
    const [rows, count] = await db.getRepository('localizationTexts').findAndCount(options);
    if (!hasTranslation) {
        return [rows, count];
    }
    return [await appendTranslations(db, rows, locale), count];
};
const list = async (ctx, next) => {
    const locale = ctx.get('X-Locale') || 'en-US';
    let { page = DEFAULT_PAGE, pageSize = DEFAULT_PER_PAGE, hasTranslation } = ctx.action.params;
    page = parseInt(String(page));
    pageSize = parseInt(String(pageSize));
    hasTranslation = hasTranslation === 'true' || hasTranslation === undefined;
    const { keyword, module } = ctx.action.params;
    const options = {
        context: ctx,
        offset: (page - 1) * pageSize,
        limit: pageSize,
    };
    const [rows, count] = await listText(ctx.db, { module, keyword, hasTranslation, locale, options });
    // append plugin displayName
    const cache = ctx.app.cache;
    const pm = ctx.app.pm;
    const plugin = pm.get('localization');
    const plugins = await cache.wrap(`lm-plugins:${locale}`, () => pm.list({ locale }));
    const sources = Array.from(plugin.sourceManager.sources.getValues());
    const extendModules = sources
        .filter((source) => source.namespace)
        .map((source) => ({
        value: source.namespace,
        label: source.title,
    }));
    const modules = [
        ...extendModules,
        ...plugins.map((plugin) => ({
            value: plugin.alias || plugin.name,
            label: plugin.displayName,
        })),
    ];
    for (const row of rows) {
        const moduleName = row.get('module').replace('resources.', '');
        const module = modules.find((module) => module.value === moduleName);
        if (module) {
            row.set('moduleTitle', module.label, { raw: true });
        }
    }
    ctx.body = {
        count,
        rows,
        page,
        pageSize,
        totalPage: Math.ceil(count / pageSize),
        modules: [
            ...extendModules,
            ...plugins.map((plugin) => ({
                value: plugin.alias || plugin.name,
                label: plugin.displayName,
            })),
        ],
    };
    await next();
};
const missing = async (ctx, next) => {
    const { keys, locale } = ctx.request.body || {};
    const currentRoles = ctx.state.currentRoles || [];
    if (!currentRoles.includes('root')) {
        const roles = await ctx.db.getRepository('roles').find({
            filter: {
                name: currentRoles,
            },
        });
        const hasUiSnippet = roles.some((role) => {
            const snippets = role.get('snippets') || [];
            return snippets.includes('ui.*');
        });
        if (!hasUiSnippet) {
            ctx.throw(403, 'No permission');
        }
    }
    if (keys?.length > 0) {
        const plugin = ctx.app.pm?.get('localization');
        const currentLocale = locale || ctx.get('X-Locale') || 'en-US';
        await plugin?.addNewTexts(keys.map((key) => ({ text: key.text, module: `resources.${key.ns}` })), {
            locale: currentLocale,
        });
    }
    await next();
};
export default { list, missing };
//# sourceMappingURL=localizationTexts.js.map