/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const sync = async (ctx, next) => {
    const startTime = Date.now();
    ctx.logger.info('Start sync localization resources');
    const plugin = ctx.app.pm.get('localization');
    const resourcesInstance = plugin.resources;
    const locale = ctx.get('X-Locale') || 'en-US';
    const { types = [] } = ctx.action.params.values || {};
    if (!types.length) {
        ctx.throw(400, ctx.t('Please provide synchronization source.'));
    }
    const resources = await plugin.sourceManager.sync(ctx, types);
    let textValues = [];
    Object.entries(resources).forEach(([module, resource]) => {
        Object.keys(resource).forEach((text) => {
            textValues.push({ module: `resources.${module}`, text });
        });
    });
    textValues = (await resourcesInstance.filterExists(textValues));
    await ctx.db.sequelize.transaction(async (t) => {
        const newTexts = await ctx.db.getModel('localizationTexts').bulkCreate(textValues, {
            transaction: t,
        });
        const texts = await ctx.db.getModel('localizationTexts').findAll({
            include: [{ association: 'translations', where: { locale }, required: false }],
            where: { '$translations.id$': null },
            transaction: t,
        });
        const translationValues = texts
            .filter((text) => {
            const module = text.module.replace('resources.', '');
            return resources[module]?.[text.text];
        })
            .map((text) => {
            const module = text.module.replace('resources.', '');
            return {
                locale,
                textId: text.id,
                translation: resources[module]?.[text.text],
            };
        });
        await ctx.db.getModel('localizationTranslations').bulkCreate(translationValues, {
            transaction: t,
        });
        await resourcesInstance.updateCacheTexts(newTexts);
    });
    ctx.logger.info(`Sync localization resources done, ${Date.now() - startTime}ms`);
    await next();
};
const publish = async (ctx, next) => {
    ctx.app.localeManager.reload();
    await next();
};
const getSources = async (ctx, next) => {
    const plugin = ctx.app.pm.get('localization');
    const sources = Array.from(plugin.sourceManager.sources.getEntities());
    ctx.body = sources.map(([name, source]) => ({
        name,
        title: source.title,
    }));
    await next();
};
export default { publish, sync, getSources };
//# sourceMappingURL=localization.js.map