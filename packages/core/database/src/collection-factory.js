/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Collection } from './collection';
export class CollectionFactory {
  database;
  // Using a Map with the collection subclass as the key and options as the value
  collectionTypes = new Map();
  constructor(database) {
    this.database = database;
  }
  registerCollectionType(
    collectionClass, // Using the collection class as the key
    options,
  ) {
    // Storing the options associated with the collection class
    this.collectionTypes.set(collectionClass, options);
  }
  createCollection(collectionOptions) {
    let klass = Collection;
    // Iterating over the map to find the right class based on the condition
    for (const [ctor, options] of this.collectionTypes) {
      if (options.condition(collectionOptions)) {
        klass = ctor;
        break;
      }
    }
    return new klass(collectionOptions, {
      database: this.database,
    });
  }
}
//# sourceMappingURL=collection-factory.js.map
