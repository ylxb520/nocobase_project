/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
import { Model as SequelizeModel } from 'sequelize';
import { SyncRunner } from './sync-runner';
const _ = lodash;
export class Model extends SequelizeModel {
  static database;
  static collection;
  _changedWithAssociations = new Set();
  _previousDataValuesWithAssociations = {};
  get db() {
    // @ts-ignore
    return this.constructor.database;
  }
  static async sync(options) {
    const runner = new SyncRunner(this);
    return await runner.runSync(options);
  }
  static callSetters(values, options) {
    // map values
    const result = {};
    for (const key of Object.keys(values)) {
      const field = this.collection.getField(key);
      if (field && field.setter) {
        result[key] = field.setter.call(field, values[key], options, values, key);
      } else {
        result[key] = values[key];
      }
    }
    return result;
  }
  // TODO
  toChangedWithAssociations() {
    // @ts-ignore
    this._changedWithAssociations = new Set([...this._changedWithAssociations, ...this._changed]);
    // @ts-ignore
    this._previousDataValuesWithAssociations = this._previousDataValues;
  }
  changedWithAssociations(key, value) {
    if (key === undefined) {
      if (this._changedWithAssociations.size > 0) {
        return Array.from(this._changedWithAssociations);
      }
      return false;
    }
    if (value === true) {
      this._changedWithAssociations.add(key);
      return this;
    }
    if (value === false) {
      this._changedWithAssociations.delete(key);
      return this;
    }
    return this._changedWithAssociations.has(key);
  }
  clearChangedWithAssociations() {
    this._changedWithAssociations = new Set();
  }
  toJSON() {
    const handleObj = (obj, options) => {
      const handles = [
        (data) => {
          if (data instanceof Model) {
            return data.toJSON();
          }
          return data;
        },
        this.hiddenObjKey,
        this.handleBigInt,
      ];
      return handles.reduce((carry, fn) => fn.apply(this, [carry, options]), obj);
    };
    const handleArray = (arrayOfObj, options) => {
      const handles = [this.sortAssociations];
      return handles.reduce((carry, fn) => fn.apply(this, [carry, options]), arrayOfObj || []);
    };
    const opts = {
      model: this.constructor,
      collection: this.constructor.collection,
      db: this.constructor.database,
    };
    const traverseJSON = (data, options) => {
      const { model, db, collection } = options;
      // handle Object
      data = handleObj(data, options);
      const result = {};
      for (const key of Object.keys(data)) {
        // @ts-ignore
        if (model.hasAlias(key)) {
          const association = model.associations[key];
          const opts = {
            model: association.target,
            collection: db.getCollection(association.target.name),
            db,
            key,
            field: collection.getField(key),
          };
          if (['HasMany', 'BelongsToMany'].includes(association.associationType)) {
            result[key] = handleArray(data[key], opts).map((item) => traverseJSON(item, opts));
          } else if (association.associationType === 'BelongsToArray') {
            const value = data[key];
            if (!value || value.some((v) => typeof v !== 'object')) {
              result[key] = value;
            } else {
              result[key] = handleArray(data[key], opts).map((item) => traverseJSON(item, opts));
            }
          } else {
            result[key] = data[key] ? traverseJSON(data[key], opts) : null;
          }
        } else {
          result[key] = data[key];
        }
      }
      return result;
    };
    return traverseJSON(super.toJSON(), opts);
  }
  hiddenObjKey(obj, options) {
    const hiddenFields = Array.from(options.collection.fields.values())
      .filter((field) => field.options.hidden)
      .map((field) => field.options.name);
    return lodash.omit(obj, hiddenFields);
  }
  handleBigInt(obj, options) {
    if (!options.db.inDialect('mariadb')) {
      return obj;
    }
    const bigIntKeys = Object.keys(options.model.rawAttributes).filter((key) => {
      return options.model.rawAttributes[key].type.constructor.name === 'BIGINT';
    });
    for (const key of bigIntKeys) {
      if (obj[key] !== null && obj[key] !== undefined && typeof obj[key] !== 'string' && typeof obj[key] !== 'number') {
        obj[key] = obj[key].toString();
      }
    }
    return obj;
  }
  sortAssociations(data, { field }) {
    const sortBy = field.options.sortBy;
    return sortBy ? this.sortArray(data, sortBy) : data;
  }
  sortArray(data, sortBy) {
    if (!lodash.isArray(sortBy)) {
      sortBy = [sortBy];
    }
    const orderItems = [];
    const orderDirections = [];
    sortBy.forEach((sortItem) => {
      orderDirections.push(sortItem.startsWith('-') ? 'desc' : 'asc');
      orderItems.push(sortItem.replace('-', ''));
    });
    return lodash.orderBy(data, orderItems, orderDirections);
  }
}
//# sourceMappingURL=model.js.map
