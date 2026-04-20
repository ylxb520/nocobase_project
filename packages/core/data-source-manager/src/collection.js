/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { default as lodash } from 'lodash';
import { CollectionField } from './collection-field';
export class Collection {
  options;
  collectionManager;
  repository;
  fields = new Map();
  constructor(options, collectionManager) {
    this.options = options;
    this.collectionManager = collectionManager;
    this.setRepository(options.repository);
    if (options.fields) {
      this.setFields(options.fields);
    }
  }
  get name() {
    return this.options.name;
  }
  get filterTargetKey() {
    return this.options.filterTargetKey;
  }
  updateOptions(options, mergeOptions) {
    const newOptions = {
      ...this.options,
      ...lodash.cloneDeep(options),
    };
    this.options = newOptions;
    this.setFields(newOptions.fields || []);
    if (options.repository) {
      this.setRepository(options.repository);
    }
    return this;
  }
  setFields(fields) {
    const fieldNames = this.fields.keys();
    for (const fieldName of fieldNames) {
      this.removeField(fieldName);
    }
    for (const field of fields) {
      this.setField(field.name, field);
    }
  }
  setField(name, options) {
    const field = new CollectionField(options);
    this.fields.set(name, field);
    return field;
  }
  removeField(name) {
    this.fields.delete(name);
  }
  getField(name) {
    return this.fields.get(name);
  }
  getFieldByField(field) {
    for (const item of this.fields.values()) {
      if (item.options.field === field) {
        return item;
      }
    }
    return null;
  }
  getFields() {
    return [...this.fields.values()];
  }
  setRepository(repository) {
    const RepositoryClass = this.collectionManager.getRegisteredRepository(repository || 'Repository');
    this.repository = new RepositoryClass(this);
  }
}
//# sourceMappingURL=collection.js.map
