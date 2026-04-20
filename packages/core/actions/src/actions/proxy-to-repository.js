/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
import { getRepositoryFromParams } from '../utils';
export function proxyToRepository(paramKeys, repositoryMethod) {
  return async function (ctx, next) {
    const repository = getRepositoryFromParams(ctx);
    const callObj = lodash.pick(ctx.action.params, paramKeys);
    callObj.context = ctx;
    ctx.body = await repository[repositoryMethod](callObj);
    ctx.status = 200;
    await next();
  };
}
//# sourceMappingURL=proxy-to-repository.js.map
