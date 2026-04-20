/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createConsoleLogger, createLogger } from '@nocobase/logger';
import { DataSourceFactory } from './data-source-factory';
export class DataSourceManager {
  options;
  dataSources;
  /**
   * @internal
   */
  factory;
  middlewares = [];
  onceHooks = [];
  beforeAddHooks = [];
  constructor(options = {}) {
    this.options = options;
    this.dataSources = new Map();
    this.factory = new DataSourceFactory(this);
    this.middlewares = [];
    if (options.app) {
      options.app.on('beforeStop', async () => {
        for (const dataSource of this.dataSources.values()) {
          await dataSource.close();
        }
      });
    }
  }
  get(dataSourceKey) {
    return this.dataSources.get(dataSourceKey);
  }
  async add(dataSource, options = {}) {
    let logger;
    if (this.options.logger) {
      if (typeof this.options.logger['log'] === 'function') {
        logger = this.options.logger;
      } else {
        logger = createLogger(this.options.logger);
      }
    } else {
      logger = createConsoleLogger();
    }
    dataSource.setLogger(logger);
    for (const hook of this.beforeAddHooks) {
      hook(dataSource);
    }
    const oldDataSource = this.dataSources.get(dataSource.name);
    if (oldDataSource) {
      if (options.reuseDB === true) {
        await oldDataSource.cleanCache();
      } else {
        await oldDataSource.close();
      }
    }
    await dataSource.load(options);
    this.dataSources.set(dataSource.name, dataSource);
    for (const hook of this.onceHooks) {
      hook(dataSource);
    }
  }
  use(fn, options) {
    this.middlewares.push([fn, options]);
  }
  middleware() {
    const self = this;
    return async function dataSourceManager(ctx, next) {
      const name = ctx.get('x-data-source') || 'main';
      if (!self.dataSources.has(name)) {
        ctx.throw(`data source ${name} does not exist`);
      }
      const ds = self.dataSources.get(name);
      ctx.dataSource = ds;
      ctx.database = ds.collectionManager.db;
      const composedFn = ds.middleware(self.middlewares);
      return composedFn(ctx, next);
    };
  }
  registerDataSourceType(type, DataSourceClass) {
    this.factory.register(type, DataSourceClass);
  }
  getDataSourceType(type) {
    return this.factory.getClass(type);
  }
  buildDataSourceByType(type, options = {}) {
    return this.factory.create(type, options);
  }
  beforeAddDataSource(hook) {
    this.beforeAddHooks.push(hook);
    for (const dataSource of this.dataSources.values()) {
      hook(dataSource);
    }
  }
  afterAddDataSource(hook) {
    this.addHookAndRun(hook);
  }
  addHookAndRun(hook) {
    this.onceHooks.push(hook);
    for (const dataSource of this.dataSources.values()) {
      hook(dataSource);
    }
  }
}
//# sourceMappingURL=data-source-manager.js.map
