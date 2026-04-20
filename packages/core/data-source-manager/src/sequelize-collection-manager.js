/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/* istanbul ignore file -- @preserve */
import { Database } from '@nocobase/database';
export class SequelizeCollectionManager {
  db;
  options;
  dataSource;
  constructor(options) {
    this.db = this.createDB(options);
    this.options = options;
  }
  setDataSource(dataSource) {
    this.dataSource = dataSource;
  }
  collectionsFilter() {
    if (this.options.collectionsFilter) {
      return this.options.collectionsFilter;
    }
    return (collection) => {
      return collection.options.introspected;
    };
  }
  createDB(options = {}) {
    if (options.database instanceof Database) {
      return options.database;
    }
    return new Database(options);
  }
  registerFieldTypes(types) {
    this.db.registerFieldTypes(types);
  }
  registerFieldInterfaces() {}
  registerCollectionTemplates() {}
  registerModels(models) {
    return this.db.registerModels(models);
  }
  registerRepositories(repositories) {
    return this.db.registerModels(repositories);
  }
  getRegisteredRepository(key) {
    if (typeof key !== 'string') {
      return key;
    }
    return this.db.repositories.get(key);
  }
  defineCollection(options) {
    const collection = this.db.collection(options);
    // @ts-ignore
    collection.model.refreshAttributes();
    // @ts-ignore
    collection.model._findAutoIncrementAttribute();
    return collection;
  }
  extendCollection(collectionOptions, mergeOptions) {
    return this.db.extendCollection(collectionOptions, mergeOptions);
  }
  hasCollection(name) {
    return this.db.hasCollection(name);
  }
  getCollection(name) {
    return this.db.getCollection(name);
  }
  removeCollection(name) {}
  getCollections() {
    const collectionsFilter = this.collectionsFilter();
    return [...this.db.collections.values()].filter((collection) => collectionsFilter(collection));
  }
  getRepository(name, sourceId) {
    return this.db.getRepository(name, sourceId);
  }
  async sync() {
    await this.db.sync();
  }
  registerFieldInterface(name, fieldInterface) {
    this.db.interfaceManager.registerInterfaceType(name, fieldInterface);
  }
  getFieldInterface(name) {
    return this.db.interfaceManager.getInterfaceType(name);
  }
}
//# sourceMappingURL=sequelize-collection-manager.js.map
