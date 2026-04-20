/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export function pageArgsToLimitArgs(page, pageSize) {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}
export function getRepositoryFromParams(ctx) {
  const { resourceName, sourceId, actionName } = ctx.action;
  if (sourceId === '_' && ['get', 'list'].includes(actionName)) {
    const collection = ctx.db.getCollection(resourceName);
    return ctx.db.getRepository(collection.name);
  }
  if (sourceId) {
    return ctx.db.getRepository(resourceName, sourceId);
  }
  return ctx.db.getRepository(resourceName);
}
export function RelationRepositoryActionBuilder(method) {
  return async function (ctx, next) {
    const repository = getRepositoryFromParams(ctx);
    const filterByTk = ctx.action.params.filterByTk || ctx.action.params.filterByTks || ctx.action.params.values;
    await repository[method](filterByTk);
    ctx.status = 200;
    await next();
  };
}
//# sourceMappingURL=utils.js.map
