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
import FilterParser from '../filter-parser';
import { OptionsParser } from '../options-parser';
import { updateAssociations } from '../update-associations';
import { UpdateGuard } from '../update-guard';
import { valuesToFilter } from '../utils/filter-utils';
export const transaction = transactionWrapperBuilder(function () {
  return this.sourceCollection.model.sequelize.transaction();
});
export class RelationRepository {
  sourceCollection;
  association;
  targetModel;
  targetCollection;
  associationName;
  associationField;
  sourceKeyValue;
  sourceInstance;
  db;
  database;
  constructor(sourceCollection, association, sourceKeyValue) {
    this.db = sourceCollection.context.database;
    this.database = this.db;
    this.sourceCollection = sourceCollection;
    this.setSourceKeyValue(sourceKeyValue);
    this.associationName = association;
    this.association = this.sourceCollection.model.associations[association];
    this.associationField = this.sourceCollection.getField(association);
    this.targetModel = this.association.target;
    this.targetCollection = this.sourceCollection.context.database.modelCollection.get(this.targetModel);
  }
  decodeMultiTargetKey(str) {
    try {
      const decoded = decodeURIComponent(str);
      const parsed = JSON.parse(decoded);
      return typeof parsed === 'object' && parsed !== null ? parsed : decoded;
    } catch (e) {
      return false;
    }
  }
  setSourceKeyValue(sourceKeyValue) {
    this.sourceKeyValue =
      typeof sourceKeyValue === 'string' ? this.decodeMultiTargetKey(sourceKeyValue) || sourceKeyValue : sourceKeyValue;
  }
  isMultiTargetKey(value) {
    return lodash.isPlainObject(value || this.sourceKeyValue);
  }
  get collection() {
    return this.db.getCollection(this.targetModel.name);
  }
  async chunk(options) {
    const { chunkSize, callback, limit: overallLimit } = options;
    const transaction = await this.getTransaction(options);
    let offset = 0;
    let totalProcessed = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Calculate the limit for the current chunk
      const currentLimit = overallLimit !== undefined ? Math.min(chunkSize, overallLimit - totalProcessed) : chunkSize;
      const rows = await this.find({
        ...options,
        limit: currentLimit,
        offset,
        transaction,
      });
      if (rows.length === 0) {
        break;
      }
      await callback(rows, options);
      offset += currentLimit;
      totalProcessed += rows.length;
      if (overallLimit !== undefined && totalProcessed >= overallLimit) {
        break;
      }
    }
  }
  convertTk(options) {
    let tk = options;
    if (typeof options === 'object' && 'tk' in options) {
      tk = options['tk'];
    }
    return tk;
  }
  convertTks(options) {
    let tk = this.convertTk(options);
    if (typeof tk === 'string') {
      tk = tk.split(',');
    }
    if (tk) {
      return lodash.castArray(tk);
    }
    return [];
  }
  targetKey() {
    return this.associationField.targetKey;
  }
  async firstOrCreate(options) {
    const { filterKeys, values, transaction, hooks, context } = options;
    const filter = valuesToFilter(values, filterKeys);
    const instance = await this.findOne({ filter, transaction, context });
    if (instance) {
      return instance;
    }
    return this.create({ values, transaction, hooks, context });
  }
  async updateOrCreate(options) {
    const { filterKeys, values, transaction, hooks, context } = options;
    const filter = valuesToFilter(values, filterKeys);
    const instance = await this.findOne({ filter, transaction, context });
    if (instance) {
      return await this.update({
        filterByTk: instance.get(
          this.targetCollection.filterTargetKey || this.targetCollection.model.primaryKeyAttribute,
        ),
        values,
        transaction,
        hooks,
        context,
      });
    }
    return this.create({ values, transaction, hooks, context });
  }
  async create(options) {
    if (Array.isArray(options.values)) {
      return Promise.all(options.values.map((record) => this.create({ ...options, values: record })));
    }
    const createAccessor = this.accessors().create;
    const guard = UpdateGuard.fromOptions(this.targetModel, options);
    const values = options.values;
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    this.collection.validate({ values, operation: 'create' });
    const instance = await sourceModel[createAccessor](guard.sanitize(options.values), { ...options, transaction });
    await updateAssociations(instance, values, { ...options, transaction });
    if (options.hooks !== false) {
      await this.db.emitAsync(`${this.targetCollection.name}.afterCreateWithAssociations`, instance, {
        ...options,
        transaction,
      });
      const eventName = `${this.targetCollection.name}.afterSaveWithAssociations`;
      await this.db.emitAsync(eventName, instance, { ...options, transaction });
    }
    return instance;
  }
  async getSourceModel(transaction) {
    if (!this.sourceInstance) {
      this.sourceInstance = this.isMultiTargetKey()
        ? await this.sourceCollection.repository.findOne({
            filter: {
              // @ts-ignore
              ...this.sourceKeyValue,
            },
            transaction,
          })
        : await this.sourceCollection.model.findOne({
            where: {
              [this.associationField.sourceKey]: this.sourceKeyValue,
            },
            transaction,
          });
    }
    return this.sourceInstance;
  }
  accessors() {
    return this.association.accessors;
  }
  buildQueryOptions(options) {
    const parser = new OptionsParser(options, {
      collection: this.targetCollection,
      targetKey: this.targetKey(),
    });
    const params = parser.toSequelizeParams();
    return { ...options, ...params };
  }
  parseFilter(filter, options) {
    const parser = new FilterParser(filter, {
      collection: this.targetCollection,
      app: {
        ctx: options?.context,
      },
    });
    return parser.toSequelizeParams();
  }
  async getTransaction(options, autoGen = false) {
    if (lodash.isPlainObject(options) && options.transaction) {
      return options.transaction;
    }
    if (autoGen) {
      return await this.sourceCollection.model.sequelize.transaction();
    }
    return null;
  }
}
__decorate([transaction()], RelationRepository.prototype, 'firstOrCreate', null);
__decorate([transaction()], RelationRepository.prototype, 'updateOrCreate', null);
__decorate([transaction()], RelationRepository.prototype, 'create', null);
//# sourceMappingURL=relation-repository.js.map
