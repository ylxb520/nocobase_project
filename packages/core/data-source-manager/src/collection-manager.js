/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Collection } from './collection';
import { Repository } from './repository';
export class CollectionManager {
  dataSource;
  collections = new Map();
  repositories = new Map();
  models = new Map();
  constructor(options = {}) {
    if (options.dataSource) {
      this.dataSource = options.dataSource;
    }
    this.registerRepositories({
      Repository: Repository,
    });
  }
  setDataSource(dataSource) {
    this.dataSource = dataSource;
  }
  /* istanbul ignore next -- @preserve */
  getRegisteredFieldType(type) {}
  /* istanbul ignore next -- @preserve */
  getRegisteredFieldInterface(key) {}
  /* istanbul ignore next -- @preserve */
  getRegisteredModel(key) {
    return this.models.get(key);
  }
  getRegisteredRepository(key) {
    if (typeof key !== 'string') {
      return key;
    }
    return this.repositories.get(key);
  }
  /* istanbul ignore next -- @preserve */
  registerFieldTypes() {}
  registerFieldInterfaces(interfaces) {
    Object.keys(interfaces).forEach((key) => {
      this.registerFieldInterface(key, interfaces[key]);
    });
  }
  registerFieldInterface(name, fieldInterface) {}
  getFieldInterface(name) {
    return;
  }
  /* istanbul ignore next -- @preserve */
  registerCollectionTemplates() {}
  registerModels(models) {
    Object.keys(models).forEach((key) => {
      this.models.set(key, models[key]);
    });
  }
  registerRepositories(repositories) {
    Object.keys(repositories).forEach((key) => {
      this.repositories.set(key, repositories[key]);
    });
  }
  defineCollection(options) {
    const collection = this.newCollection(options);
    this.collections.set(options.name, collection);
    return collection;
  }
  extendCollection(collectionOptions, mergeOptions) {
    const collection = this.getCollection(collectionOptions.name);
    collection.updateOptions(collectionOptions, mergeOptions);
    return collection;
  }
  hasCollection(name) {
    return !!this.getCollection(name);
  }
  getCollection(name) {
    return this.collections.get(name);
  }
  getCollections() {
    return [...this.collections.values()];
  }
  getRepository(name, sourceId) {
    const collection = this.getCollection(name);
    return collection.repository;
  }
  async sync() {}
  removeCollection(name) {
    this.collections.delete(name);
  }
  newCollection(options) {
    // @ts-ignore
    return new Collection(options, this);
  }
}
//# sourceMappingURL=collection-manager.js.map
