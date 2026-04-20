/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export async function saveSchema(ctx, next) {
  const { filterByTk, values, removeParentsIfNoChildren, breakRemoveOn, position } = ctx.action.params;
  const repository = ctx.db.getRepository('uiSchemas');
  const schema = values.schema;
  ctx.body = await repository.insertAdjacent(position, filterByTk, schema, {
    removeParentsIfNoChildren,
    breakRemoveOn,
    wrap: null,
  });
  await next();
}
//# sourceMappingURL=saveSchema.js.map
