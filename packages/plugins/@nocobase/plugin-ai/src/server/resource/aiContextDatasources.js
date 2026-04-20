/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export const aiContextDatasources = {
  name: 'aiContextDatasources',
  actions: {
    preview: async (ctx, next) => {
      const plugin = ctx.app.pm.get('ai');
      ctx.body = await plugin.aiContextDatasourceManager.preview(ctx, ctx.action.params.values);
      next();
    },
  },
};
//# sourceMappingURL=aiContextDatasources.js.map
