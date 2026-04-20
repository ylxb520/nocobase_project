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
import { isValidFilter } from '@nocobase/utils';
import lodash from 'lodash';
import { Op, QueryTypes, Sequelize, Utils } from 'sequelize';
import _ from 'lodash';
import { BelongsToArrayRepository } from './belongs-to-array/belongs-to-array-repository';
import { SmartCursorBuilder } from './cursor-builder';
import mustHaveFilter from './decorators/must-have-filter-decorator';
import injectTargetCollection from './decorators/target-collection-decorator';
import { transactionWrapperBuilder } from './decorators/transaction-decorator';
import { EagerLoadingTree } from './eager-loading/eager-loading-tree';
import { ArrayFieldRepository } from './field-repository/array-field-repository';
import { ArrayField } from './fields';
import FilterParser from './filter-parser';
import { OptionsParser } from './options-parser';
import { BelongsToManyRepository } from './relation-repository/belongs-to-many-repository';
import { BelongsToRepository } from './relation-repository/belongs-to-repository';
import { HasManyRepository } from './relation-repository/hasmany-repository';
import { HasOneRepository } from './relation-repository/hasone-repository';
import { updateAssociations, updateModelByValues } from './update-associations';
import { UpdateGuard } from './update-guard';
import { processIncludes } from './utils';
import { valuesToFilter } from './utils/filter-utils';
const debug = require('debug')('noco-database');
const transaction = transactionWrapperBuilder(function () {
  return this.collection.model.sequelize.transaction();
});
class RelationRepositoryBuilder {
  collection;
  associationName;
  association;
  builderMap = {
    HasOne: HasOneRepository,
    BelongsTo: BelongsToRepository,
    BelongsToMany: BelongsToManyRepository,
    HasMany: HasManyRepository,
    ArrayField: ArrayFieldRepository,
    BelongsToArray: BelongsToArrayRepository,
  };
  constructor(collection, associationName) {
    this.collection = collection;
    this.associationName = associationName;
    this.association = this.collection.model.associations[this.associationName];
    if (this.association) {
      return;
    }
    const field = collection.getField(associationName);
    if (!field) {
      return;
    }
    if (field instanceof ArrayField) {
      this.association = {
        associationType: 'ArrayField',
      };
    }
  }
  of(id) {
    if (!this.association) {
      return;
    }
    const klass = this.builder()[this.association.associationType];
    return new klass(this.collection, this.associationName, id);
  }
  builder() {
    return this.builderMap;
  }
}
export class Repository {
  database;
  collection;
  model;
  cursorBuilder;
  constructor(collection) {
    this.database = collection.context.database;
    this.collection = collection;
    this.model = collection.model;
    this.cursorBuilder = new SmartCursorBuilder(this.database.sequelize, this.model.tableName, this.collection);
  }
  static valuesToFilter = valuesToFilter;
  /**
   * return count by filter
   */
  async count(countOptions) {
    let options = countOptions ? lodash.clone(countOptions) : {};
    const transaction = await this.getTransaction(options);
    if (countOptions?.filter) {
      options = {
        ...options,
        ...this.parseFilter(countOptions.filter, countOptions),
      };
    }
    if (countOptions?.filterByTk) {
      const optionParser = new OptionsParser(options, {
        collection: this.collection,
      });
      options['where'] = {
        [Op.and]: [options['where'] || {}, optionParser.filterByTkToWhereOption()],
      };
    }
    const queryOptions = {
      ...options,
      distinct: Boolean(this.collection.model.primaryKeyAttribute) && !this.collection.isMultiFilterTargetKey(),
    };
    if (Array.isArray(queryOptions.include) && queryOptions.include.length > 0) {
      queryOptions.include = processIncludes(queryOptions.include, this.collection.model);
    } else {
      delete queryOptions.include;
    }
    // @ts-ignore
    return await this.collection.model.count({
      ...queryOptions,
      transaction,
    });
  }
  async getEstimatedRowCount() {
    if (_.isFunction(this.collection['isSql']) && this.collection['isSql']()) {
      return 0;
    }
    if (_.isFunction(this.collection['isView']) && this.collection['isView']()) {
      return 0;
    }
    const tableName = this.collection.tableName();
    try {
      if (this.database.isMySQLCompatibleDialect()) {
        const results = await this.database.sequelize.query(
          `
        SELECT table_rows FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = ?
      `,
          { replacements: [tableName], type: QueryTypes.SELECT },
        );
        return Number(results?.[0]?.[this.database.inDialect('mysql') ? 'TABLE_ROWS' : 'table_rows'] ?? 0);
      }
      if (this.database.isPostgresCompatibleDialect()) {
        const results = await this.database.sequelize.query(
          `
        SELECT reltuples::BIGINT AS estimate
        FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE c.relname = ? AND n.nspname = ?;
      `,
          { replacements: [tableName, this.collection.collectionSchema()], type: QueryTypes.SELECT, logging: true },
        );
        return Number(results?.[0]?.estimate ?? 0);
      }
      if (this.database.sequelize.getDialect() === 'mssql') {
        const results = await this.database.sequelize.query(
          `
        SELECT SUM(row_count) AS estimate
        FROM sys.dm_db_partition_stats
        WHERE object_id = OBJECT_ID(?) AND (index_id = 0 OR index_id = 1)
      `,
          { replacements: [tableName], type: QueryTypes.SELECT },
        );
        return Number(results?.[0]?.estimate ?? 0);
      }
      if (this.database.sequelize.getDialect() === 'oracle') {
        const tableName = this.collection.name.toUpperCase();
        const schemaName = (await this.getOracleSchema()).toUpperCase();
        await this.database.sequelize.query(`BEGIN DBMS_STATS.GATHER_TABLE_STATS(:schema, :table); END;`, {
          replacements: { schema: schemaName, table: tableName },
          type: QueryTypes.RAW,
        });
        const results = await this.database.sequelize.query(
          `
      SELECT NUM_ROWS AS "estimate"
      FROM ALL_TABLES
      WHERE TABLE_NAME = :table AND OWNER = :schema
      `,
          {
            replacements: { table: tableName, schema: schemaName },
            type: QueryTypes.SELECT,
          },
        );
        return Number(results?.[0]?.estimate ?? 0);
      }
    } catch (error) {
      this.database.logger.error(`Failed to get estimated row count for ${this.collection.name}:`, error);
      return 0;
    }
    return 0;
  }
  async getOracleSchema() {
    const [result] = await this.database.sequelize.query(`SELECT USER FROM DUAL`, {
      type: QueryTypes.SELECT,
    });
    return result?.['USER'] ?? '';
  }
  async aggregate(options) {
    const { method, field } = options;
    const queryOptions = this.buildQueryOptions({
      ...options,
      fields: [],
    });
    options.optionsTransformer?.(queryOptions);
    delete queryOptions.order;
    const hasAssociationFilter = (() => {
      if (queryOptions.include && queryOptions.include.length > 0) {
        const filterInclude = queryOptions.include.filter((include) => {
          return (
            Object.keys(include.where || {}).length > 0 ||
            JSON.stringify(queryOptions?.filter)?.includes(include.association)
          );
        });
        return filterInclude.length > 0;
      }
      return false;
    })();
    if (hasAssociationFilter) {
      const primaryKeyField = this.model.primaryKeyAttribute;
      const queryInterface = this.database.sequelize.getQueryInterface();
      const findOptions = {
        ...queryOptions,
        raw: true,
        includeIgnoreAttributes: false,
        attributes: [
          [
            Sequelize.literal(
              `DISTINCT ${queryInterface.quoteIdentifiers(`${this.collection.name}.${primaryKeyField}`)}`,
            ),
            primaryKeyField,
          ],
        ],
      };
      const ids = await this.model.findAll(findOptions);
      return await this.model.aggregate(field, method, {
        ...lodash.omit(queryOptions, ['where', 'include']),
        where: {
          [primaryKeyField]: ids.map((node) => node[primaryKeyField]),
        },
      });
    }
    return await this.model.aggregate(field, method, queryOptions);
  }
  async chunk(options) {
    const { chunkSize, callback, limit: overallLimit, beforeFind, afterFind } = options;
    const transaction = await this.getTransaction(options);
    let offset = 0;
    let totalProcessed = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Calculate the limit for the current chunk
      const currentLimit = overallLimit !== undefined ? Math.min(chunkSize, overallLimit - totalProcessed) : chunkSize;
      const findOptions = {
        ...options,
        limit: currentLimit,
        offset,
        transaction,
      };
      if (beforeFind) {
        await beforeFind(findOptions);
      }
      const rows = await this.find(findOptions);
      if (afterFind) {
        await afterFind(rows, { ...findOptions, offset });
      }
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
  /**
   * Cursor-based pagination query function.
   * Ideal for large datasets (e.g., millions of rows)
   * Note:
   *  1. does not support jumping to arbitrary pages (e.g., "Page 5")
   *  2. Requires a stable, indexed sort field (e.g. ID, createdAt)
   *  3. If custom orderBy is used, it must match the cursor field(s) and direction, otherwise results may be incorrect or unstable.
   * @param options
   */
  async chunkWithCursor(options) {
    return await this.cursorBuilder.chunk({
      ...options,
      find: this.find.bind(this),
    });
  }
  /**
   * find
   * @param options
   */
  async find(options = {}) {
    if (options?.targetCollection && options?.targetCollection !== this.collection.name) {
      return await this.database.getCollection(options.targetCollection).repository.find(options);
    }
    const model = this.collection.model;
    const transaction = await this.getTransaction(options);
    const opts = {
      subQuery: false,
      ...this.buildQueryOptions(options),
    };
    if (!_.isUndefined(opts.limit)) {
      opts.limit = Number(opts.limit);
    }
    let rows;
    if (opts.include && opts.include.length > 0) {
      const eagerLoadingTree = EagerLoadingTree.buildFromSequelizeOptions({
        model,
        rootAttributes: opts.attributes,
        includeOption: opts.include,
        rootOrder: opts.order,
        rootQueryOptions: opts,
        db: this.database,
      });
      await eagerLoadingTree.load(transaction);
      rows = eagerLoadingTree.root.instances;
    } else {
      if (opts.where && model.primaryKeyAttributes.length === 0) {
        opts.where = Utils.mapWhereFieldNames(opts.where, model);
      }
      rows = await model.findAll({
        ...opts,
        transaction,
      });
    }
    await this.collection.db.emitAsync('afterRepositoryFind', {
      findOptions: options,
      dataCollection: this.collection,
      data: rows,
    });
    return rows;
  }
  /**
   * find and count
   * @param options
   */
  async findAndCount(options) {
    options = {
      ...options,
      transaction: await this.getTransaction(options),
    };
    const count = await this.count(options);
    const results = count ? await this.find(options) : [];
    return [results, count];
  }
  /**
   * Find By Id
   *
   */
  findById(id) {
    return this.collection.model.findByPk(id);
  }
  findByTargetKey(targetKey) {
    return this.findOne({ filterByTk: targetKey });
  }
  /**
   * Find one record from database
   *
   * @param options
   */
  async findOne(options) {
    const transaction = await this.getTransaction(options);
    const rows = await this.find({ ...options, limit: 1, transaction });
    return rows.length == 1 ? rows[0] : null;
  }
  /**
   * Get the first record matching the attributes or create it.
   */
  async firstOrCreate(options) {
    const { filterKeys, values, transaction, context, ...rest } = options;
    const filter = Repository.valuesToFilter(values, filterKeys);
    const instance = await this.findOne({ filter, transaction, context });
    if (instance) {
      return instance;
    }
    return this.create({ values, transaction, context, ...rest });
  }
  async updateOrCreate(options) {
    const { filterKeys, values, transaction, context, ...rest } = options;
    const filter = Repository.valuesToFilter(values, filterKeys);
    const instance = await this.findOne({ filter, transaction, context });
    if (instance) {
      return await this.update({
        filterByTk: instance.get(this.collection.filterTargetKey || this.collection.model.primaryKeyAttribute),
        values,
        transaction,
        context,
        ...rest,
      });
    }
    return this.create({ values, transaction, context, ...rest });
  }
  validate(options) {
    this.collection.validate(options);
  }
  /**
   * Save instance to database
   *
   * @param values
   * @param options
   */
  async create(options) {
    if (Array.isArray(options.values)) {
      return this.createMany({
        ...options,
        records: options.values,
      });
    }
    const transaction = await this.getTransaction(options);
    const guard = UpdateGuard.fromOptions(this.model, {
      ...options,
      action: 'create',
      underscored: this.collection.options.underscored,
    });
    const values = this.model.callSetters(guard.sanitize(options.values || {}), options);
    this.validate({ values: values, operation: 'create' });
    const instance = await this.model.create(values, {
      ...options,
      transaction,
    });
    if (!instance) {
      return;
    }
    await updateAssociations(instance, values, {
      ...options,
      transaction,
    });
    if (options.hooks !== false) {
      await this.database.emitAsync(`${this.collection.name}.afterCreateWithAssociations`, instance, {
        ...options,
        transaction,
      });
      await this.database.emitAsync(`${this.collection.name}.afterSaveWithAssociations`, instance, {
        ...options,
        transaction,
      });
      instance.clearChangedWithAssociations();
    }
    return instance;
  }
  /**
   * Save Many instances to database
   *
   * @param records
   * @param options
   */
  async createMany(options) {
    const transaction = await this.getTransaction(options);
    const { records } = options;
    const instances = [];
    for (const values of records) {
      const instance = await this.create({ ...options, values, transaction });
      instances.push(instance);
    }
    return instances;
  }
  /**
   * Update model value
   *
   * @param values
   * @param options
   */
  async update(options) {
    if (Array.isArray(options.values)) {
      return this.updateMany({
        ...options,
        records: options.values,
      });
    }
    const transaction = await this.getTransaction(options);
    const guard = UpdateGuard.fromOptions(this.model, { ...options, underscored: this.collection.options.underscored });
    const values = this.model.callSetters(guard.sanitize(options.values || {}), options);
    this.validate({ values: values, operation: 'update' });
    // NOTE:
    // 1. better to be moved to separated API like bulkUpdate/updateMany
    // 2. strictly `false` comparing for compatibility of legacy api invoking
    if (options.individualHooks === false) {
      const { model: Model } = this.collection;
      // @ts-ignore
      const primaryKeyField = Model.primaryKeyField || Model.primaryKeyAttribute;
      // NOTE:
      // 1. find ids first for reusing `queryOptions` logic
      // 2. estimation memory usage will be N * M bytes (N = rows, M = model object memory)
      // 3. would be more efficient up to 100000 ~ 1000000 rows
      const queryOptions = this.buildQueryOptions({
        ...options,
        fields: [primaryKeyField],
      });
      const rows = await this.find({
        ...queryOptions,
        transaction,
      });
      const [result] = await Model.update(values, {
        where: {
          [primaryKeyField]: rows.map((row) => row.get(primaryKeyField)),
        },
        fields: options.fields,
        hooks: options.hooks,
        validate: options.validate,
        sideEffects: options.sideEffects,
        limit: options.limit,
        silent: options.silent,
        transaction,
      });
      // TODO: not support association fields except belongsTo
      return result;
    }
    const queryOptions = this.buildQueryOptions(options);
    const instances = await this.find({
      ...queryOptions,
      transaction,
    });
    for (const instance of instances) {
      await updateModelByValues(instance, values, {
        ...options,
        sanitized: true,
        transaction,
      });
    }
    if (options.hooks !== false) {
      for (const instance of instances) {
        await this.database.emitAsync(`${this.collection.name}.afterUpdateWithAssociations`, instance, {
          ...options,
          transaction,
        });
        await this.database.emitAsync(`${this.collection.name}.afterSaveWithAssociations`, instance, {
          ...options,
          transaction,
        });
        instance.clearChangedWithAssociations();
      }
    }
    return instances;
  }
  async updateMany(options) {
    const transaction = await this.getTransaction(options);
    const { records } = options;
    const instances = [];
    for (const values of records) {
      const filterByTk = values[this.model.primaryKeyAttribute];
      if (!filterByTk) {
        throw new Error('filterByTk invalid');
      }
      const instance = await this.update({ values, filterByTk, transaction });
      instances.push(instance);
    }
    return instances;
  }
  async destroy(options) {
    const transaction = await this.getTransaction(options);
    const modelFilterKey = this.collection.filterTargetKey;
    options = options;
    if (options['individualHooks'] === undefined) {
      options['individualHooks'] = true;
    }
    const filterByTk =
      options.filterByTk && !lodash.isArray(options.filterByTk) ? [options.filterByTk] : options.filterByTk;
    if (
      this.collection.model.primaryKeyAttributes.length !== 1 &&
      filterByTk &&
      !lodash.get(this.collection.options, 'filterTargetKey')
    ) {
      if (this.collection.model.primaryKeyAttributes.length > 1) {
        throw new Error(`filterByTk is not supported for composite primary key`);
      } else {
        throw new Error(`filterByTk is not supported for collection that has no primary key`);
      }
    }
    if (filterByTk && !isValidFilter(options.filter)) {
      const where = [];
      for (const tk of filterByTk) {
        const optionParser = new OptionsParser(
          {
            filterByTk: tk,
          },
          {
            collection: this.collection,
          },
        );
        where.push(optionParser.filterByTkToWhereOption());
      }
      const destroyOptions = {
        ...options,
        where: {
          [Op.or]: where,
        },
        transaction,
      };
      return await this.model.destroy(destroyOptions);
    }
    if (options.filter && isValidFilter(options.filter)) {
      if (
        this.collection.model.primaryKeyAttributes.length !== 1 &&
        !lodash.get(this.collection.options, 'filterTargetKey')
      ) {
        const queryOptions = {
          ...this.buildQueryOptions(options),
        };
        return await this.model.destroy({
          ...queryOptions,
          transaction,
        });
      }
      let pks = (
        await this.find({
          filter: options.filter,
          transaction,
        })
      ).map((instance) => instance.get(modelFilterKey));
      if (filterByTk) {
        pks = lodash.intersection(
          pks.map((i) => `${i}`),
          filterByTk.map((i) => `${i}`),
        );
      }
      return await this.destroy({
        ...lodash.omit(options, 'filter'),
        filterByTk: pks,
        transaction,
      });
    }
    if (options.truncate) {
      return await this.model.destroy({
        ...options,
        truncate: true,
        transaction,
      });
    }
  }
  /**
   * @param association target association
   */
  relation(association) {
    return new RelationRepositoryBuilder(this.collection, association);
  }
  buildQueryOptions(options) {
    const parser = new OptionsParser(options, {
      collection: this.collection,
    });
    const params = parser.toSequelizeParams({ parseSort: _.isBoolean(options?.parseSort) ? options.parseSort : true });
    debug('sequelize query params %o', params);
    if (options.where && params.where) {
      params.where = {
        [Op.and]: [params.where, options.where],
      };
    }
    return { where: {}, ...options, ...params };
  }
  parseFilter(filter, options) {
    const parser = new FilterParser(filter, {
      collection: this.collection,
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
      return await this.model.sequelize.transaction();
    }
    return null;
  }
}
__decorate([transaction()], Repository.prototype, 'create', null);
__decorate([transaction()], Repository.prototype, 'createMany', null);
__decorate([transaction(), mustHaveFilter(), injectTargetCollection], Repository.prototype, 'update', null);
__decorate([transaction()], Repository.prototype, 'updateMany', null);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        filterByTk: args[0],
        transaction,
      };
    }),
  ],
  Repository.prototype,
  'destroy',
  null,
);
//# sourceMappingURL=repository.js.map
