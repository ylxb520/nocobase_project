/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
import lodash from 'lodash';
import { transactionWrapperBuilder } from '../decorators/transaction-decorator';
import { ArrayField } from '../fields';
const transaction = transactionWrapperBuilder(function () {
  return this.collection.model.sequelize.transaction();
});
export class ArrayFieldRepository {
  collection;
  fieldName;
  targetValue;
  constructor(collection, fieldName, targetValue) {
    this.collection = collection;
    this.fieldName = fieldName;
    this.targetValue = targetValue;
    const field = collection.getField(fieldName);
    if (!(field instanceof ArrayField)) {
      throw new Error('Field must be of type Array');
    }
  }
  async get(options) {
    const instance = await this.getInstance(options);
    return instance.get(this.fieldName);
  }
  async find(options) {
    return await this.get(options);
  }
  async set(options) {
    const { transaction } = options;
    const instance = await this.getInstance({
      transaction,
    });
    instance.set(this.fieldName, lodash.castArray(options.values));
    await instance.save({ transaction });
    if (options.hooks !== false) {
      await this.emitAfterSave(instance, options);
    }
  }
  async emitAfterSave(instance, options) {
    await this.collection.db.emitAsync(`${this.collection.name}.afterSaveWithAssociations`, instance, {
      ...options,
    });
    instance.clearChangedWithAssociations();
  }
  async toggle(options) {
    const { transaction } = options;
    const instance = await this.getInstance({
      transaction,
    });
    const oldValue = instance.get(this.fieldName) || [];
    const newValue = oldValue.includes(options.value)
      ? lodash.without(oldValue, options.value)
      : [...oldValue, options.value];
    instance.set(this.fieldName, newValue);
    await instance.save({ transaction });
    if (options.hooks !== false) {
      await this.emitAfterSave(instance, options);
    }
  }
  async add(options) {
    const { transaction } = options;
    const instance = await this.getInstance({
      transaction,
    });
    const oldValue = instance.get(this.fieldName) || [];
    const newValue = [...oldValue, ...lodash.castArray(options.values)];
    instance.set(this.fieldName, newValue);
    await instance.save({ transaction });
    if (options.hooks !== false) {
      await this.emitAfterSave(instance, options);
    }
  }
  async remove(options) {
    const { transaction } = options;
    const instance = await this.getInstance({
      transaction,
    });
    const oldValue = instance.get(this.fieldName) || [];
    instance.set(this.fieldName, lodash.without(oldValue, ...lodash.castArray(options.values)));
    await instance.save({ transaction });
    if (options.hooks !== false) {
      await this.emitAfterSave(instance, options);
    }
  }
  getInstance(options) {
    return this.collection.repository.findOne({
      filterByTk: this.targetValue,
    });
  }
}
__decorate([transaction()], ArrayFieldRepository.prototype, 'get', null);
__decorate([transaction()], ArrayFieldRepository.prototype, 'find', null);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        values: args[0],
        transaction,
      };
    }),
  ],
  ArrayFieldRepository.prototype,
  'set',
  null,
);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        value: args[0],
        transaction,
      };
    }),
  ],
  ArrayFieldRepository.prototype,
  'toggle',
  null,
);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        values: args[0],
        transaction,
      };
    }),
  ],
  ArrayFieldRepository.prototype,
  'add',
  null,
);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        values: args[0],
        transaction,
      };
    }),
  ],
  ArrayFieldRepository.prototype,
  'remove',
  null,
);
//# sourceMappingURL=array-field-repository.js.map
