/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class DataSourceFactory {
  dataSourceManager;
  collectionTypes = new Map();
  constructor(dataSourceManager) {
    this.dataSourceManager = dataSourceManager;
  }
  register(type, dataSourceClass) {
    this.collectionTypes.set(type, dataSourceClass);
  }
  getClass(type) {
    return this.collectionTypes.get(type);
  }
  create(type, options = {}) {
    const klass = this.getClass(type);
    if (!klass) {
      throw new Error(`Data source type "${type}" not found`);
    }
    const environment = this.dataSourceManager.options.app?.environment;
    const { logger, sqlLogger, databaseInstance, ...others } = options;
    const opts = { logger, sqlLogger, databaseInstance, ...others };
    if (environment) {
      Object.assign(opts, environment.renderJsonTemplate(others));
    }
    const dataSource = new klass(opts);
    dataSource.setDataSourceManager(this.dataSourceManager);
    return dataSource;
  }
}
//# sourceMappingURL=data-source-factory.js.map
