/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
const getRepositoryFromCtx = (ctx) => {
    const repo = ctx.db.getCollection('uiSchemas').repository;
    repo.setCache(ctx.cache);
    return repo;
};
const callRepositoryMethod = (method, paramsKey, optionsBuilder) => {
    return async (ctx, next) => {
        const params = lodash.get(ctx.action.params, paramsKey);
        const options = optionsBuilder ? optionsBuilder(ctx.action.params) : {};
        const repository = getRepositoryFromCtx(ctx);
        const returnValue = await repository[method](params, options);
        ctx.body = returnValue || {
            result: 'ok',
        };
        await next();
    };
};
function parseInsertAdjacentValues(values) {
    if (lodash.has(values, 'schema')) {
        return values;
    }
    return { schema: values, wrap: null };
}
export const uiSchemaActions = {
    getJsonSchema: callRepositoryMethod('getJsonSchema', 'resourceIndex', (params) => {
        const includeAsyncNode = params?.includeAsyncNode;
        return {
            readFromCache: !includeAsyncNode,
            includeAsyncNode,
        };
    }),
    getProperties: callRepositoryMethod('getProperties', 'resourceIndex', () => ({
        readFromCache: true,
    })),
    getParentJsonSchema: callRepositoryMethod('getParentJsonSchema', 'resourceIndex'),
    getParentProperty: callRepositoryMethod('getParentProperty', 'resourceIndex'),
    insert: callRepositoryMethod('insert', 'values'),
    insertNewSchema: callRepositoryMethod('insertNewSchema', 'values'),
    remove: callRepositoryMethod('remove', 'resourceIndex'),
    patch: callRepositoryMethod('patch', 'values'),
    initializeActionContext: callRepositoryMethod('initializeActionContext', 'values'),
    batchPatch: callRepositoryMethod('batchPatch', 'values'),
    clearAncestor: callRepositoryMethod('clearAncestor', 'resourceIndex'),
    insertAdjacent: insertPositionActionBuilder(),
    insertBeforeBegin: insertPositionActionBuilder('beforeBegin'),
    insertAfterBegin: insertPositionActionBuilder('afterBegin'),
    insertBeforeEnd: insertPositionActionBuilder('beforeEnd'),
    insertAfterEnd: insertPositionActionBuilder('afterEnd'),
    async saveAsTemplate(ctx, next) {
        const { filterByTk, values } = ctx.action.params;
        const db = ctx.db;
        const transaction = await db.sequelize.transaction();
        try {
            await db.getRepository('uiSchemaTemplates').create({
                values: {
                    ...values,
                    uid: filterByTk,
                },
                transaction,
            });
            await getRepositoryFromCtx(ctx).clearAncestor(filterByTk, { transaction });
            ctx.body = {
                result: 'ok',
            };
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
        await next();
    },
};
function insertPositionActionBuilder(position = undefined) {
    return async function (ctx, next) {
        const { resourceIndex, values, removeParentsIfNoChildren, breakRemoveOn, position: positionFromUser, } = ctx.action.params;
        const repository = getRepositoryFromCtx(ctx);
        const { schema, wrap } = parseInsertAdjacentValues(values);
        ctx.body = await repository.insertAdjacent(position || positionFromUser, resourceIndex, schema, {
            removeParentsIfNoChildren,
            breakRemoveOn,
            wrap,
        });
        await next();
    };
}
//# sourceMappingURL=ui-schema-action.js.map