/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export default {
  name: 'mainDataSource',
  actions: {
    async refresh(ctx, next) {
      const plugin = ctx.app.pm.get('data-source-main');
      const mainDataSource = ctx.app.dataSourceManager.get('main');
      if (mainDataSource.status === 'loaded') {
        await plugin.loadCollections();
      }
      await next();
    },
    async syncFields(ctx, next) {
      const { collections } = ctx.action.params.values || {};
      const mainDataSource = ctx.app.dataSourceManager.get('main');
      if (mainDataSource.status === 'loaded') {
        await mainDataSource.syncFieldsFromDatabase(ctx, collections);
      }
      await next();
    },
  },
};
//# sourceMappingURL=main-data-source.js.map
