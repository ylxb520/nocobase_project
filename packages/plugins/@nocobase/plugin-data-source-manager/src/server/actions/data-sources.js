/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { mapDataSourceWithCollection } from '../utils';
const canRefreshStatus = ['loaded', 'loading-failed', 'reloading-failed'];
export default {
  async ['dataSources:listEnabled'](ctx, next) {
    const dataSources = await ctx.db.getRepository('dataSources').find({
      filter: {
        enabled: true,
        'type.$ne': 'main',
      },
    });
    ctx.body = dataSources.map((dataSourceModel) => {
      return mapDataSourceWithCollection(ctx.app, dataSourceModel);
    });
    await next();
  },
  async ['dataSources:testConnection'](ctx, next) {
    const { values } = ctx.action.params;
    const { options, type } = values;
    const klass = ctx.app.dataSourceManager.factory.getClass(type);
    try {
      await klass.testConnection(ctx.app.environment.renderJsonTemplate(options));
    } catch (error) {
      throw new Error(`Test connection failed: ${error.message}`);
    }
    ctx.body = {
      success: true,
    };
    await next();
  },
  async ['dataSources:refresh'](ctx, next) {
    const plugin = ctx.app.pm.get('data-source-manager');
    const { filterByTk, clientStatus } = ctx.action.params;
    const dataSourceModel = await ctx.db.getRepository('dataSources').findOne({
      filter: {
        key: filterByTk,
      },
    });
    const currentStatus = plugin.dataSourceStatus[filterByTk];
    if (
      canRefreshStatus.includes(currentStatus) &&
      (clientStatus ? clientStatus && canRefreshStatus.includes(clientStatus) : true)
    ) {
      dataSourceModel.loadIntoApplication({
        app: ctx.app,
        refresh: true,
        reuseDB: true,
      });
      ctx.app.syncMessageManager.publish(plugin.name, {
        type: 'loadDataSource',
        dataSourceKey: dataSourceModel.get('key'),
      });
    }
    ctx.body = {
      status: plugin.dataSourceStatus[filterByTk],
    };
    await next();
  },
  async ['dataSources:readTables'](ctx, next) {
    const { dataSourceKey, dbOptions } = ctx.action.params.values || {};
    const dataSourceManager = ctx.app.dataSourceManager;
    let dataSource;
    if (dbOptions) {
      dataSource = dataSourceManager.factory.create(dbOptions.type, {
        name: dataSourceKey,
        ...dbOptions,
      });
    } else {
      dataSource = dataSourceManager.dataSources.get(dataSourceKey);
      if (!dataSource) {
        throw new Error(`dataSource ${dataSourceKey} not found`);
      }
    }
    const tables = await dataSource.readTables();
    ctx.body = tables;
    await next();
  },
  async ['dataSources:loadTables'](ctx, next) {
    const { dataSourceKey, tables } = ctx.action.params.values || {};
    const dataSourceManager = ctx.app.dataSourceManager;
    const dataSource = dataSourceManager.dataSources.get(dataSourceKey);
    if (!dataSource) {
      throw new Error(`dataSource ${dataSourceKey} not found`);
    }
    await dataSource.loadTables(ctx, tables);
    await next();
  },
};
//# sourceMappingURL=data-sources.js.map
