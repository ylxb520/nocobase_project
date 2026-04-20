/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { getRepositoryFromParams } from '../utils';
export async function create(ctx, next) {
  const repository = getRepositoryFromParams(ctx);
  const { whitelist, blacklist, updateAssociationValues, values } = ctx.action.params;
  const instance = await repository.create({
    values,
    whitelist,
    blacklist,
    updateAssociationValues,
    context: ctx,
  });
  ctx.body = instance;
  await next();
}
//# sourceMappingURL=create.js.map
