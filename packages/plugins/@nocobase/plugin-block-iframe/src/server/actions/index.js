/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export async function getHtml(ctx, next) {
  const { filterByTk } = ctx.action.params;
  const { resourceName } = ctx.action;
  const repository = ctx.db.getRepository(resourceName);
  const model = await repository.findById(filterByTk);
  ctx.body = model.get('html');
  ctx.withoutDataWrapping = true;
  ctx.set({
    'Content-Type': 'text/html; charset=UTF-8',
  });
  await next();
}
//# sourceMappingURL=index.js.map
