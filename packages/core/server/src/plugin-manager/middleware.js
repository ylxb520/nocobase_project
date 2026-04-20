/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { koaMulter as multer } from '@nocobase/utils';
export async function uploadMiddleware(ctx, next) {
  if (ctx.action.resourceName === 'pm' && ['add', 'update'].includes(ctx.action.actionName)) {
    const upload = multer().single('file');
    return upload(ctx, next);
  }
  return next();
}
//# sourceMappingURL=middleware.js.map
