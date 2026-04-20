/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
export function proxyToRepository(paramKeys, repositoryMethod) {
  return async function (ctx, next) {
    const repository = ctx.getCurrentRepository();
    const callObj =
      typeof paramKeys === 'function' ? paramKeys(ctx) : { ...lodash.pick(ctx.action.params, paramKeys), context: ctx };
    const dataSource = ctx.dataSource;
    if (!repository[repositoryMethod]) {
      throw new Error(
        `Repository can not handle action ${repositoryMethod} for ${ctx.action.resourceName} in ${dataSource.name}`,
      );
    }
    ctx.body = await repository[repositoryMethod](callObj);
    await next();
  };
}
//# sourceMappingURL=proxy-to-repository.js.map
