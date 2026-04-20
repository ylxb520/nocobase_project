/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import _ from 'lodash';
import { snakeCase } from '../utils';
export class Field {
  options;
  context;
  database;
  collection;
  constructor(options, context) {
    this.context = context;
    this.database = this.context.database;
    this.collection = this.context.collection;
    this.options = options || {};
    this.init();
  }
  get name() {
    return this.options.name;
  }
  get type() {
    return this.options.type;
  }
  isRelationField() {
    return false;
  }
  async sync(syncOptions) {
    await this.collection.sync({
      ...syncOptions,
      force: false,
      alter: {
        drop: false,
      },
    });
  }
  init() {
    // code
  }
  on(eventName, listener) {
    this.database.on(`${this.collection.name}.${eventName}`, listener);
    return this;
  }
  off(eventName, listener) {
    this.database.off(`${this.collection.name}.${eventName}`, listener);
    return this;
  }
  get(name) {
    return this.options[name];
  }
  remove() {
    this.collection.removeIndex([this.name]);
    return this.collection.removeField(this.name);
  }
  columnName() {
    if (this.options.field) {
      return this.options.field;
    }
    if (this.database.options.underscored) {
      return snakeCase(this.name);
    }
    return this.name;
  }
  async existsInDb(options) {
    const opts = {
      transaction: options?.transaction,
    };
    let sql;
    if (this.database.sequelize.getDialect() === 'sqlite') {
      sql = `SELECT *
             from pragma_table_info('${this.collection.model.tableName}')
             WHERE name = '${this.columnName()}'`;
    } else if (this.database.inDialect('mysql', 'mariadb')) {
      sql = `
        select column_name
        from INFORMATION_SCHEMA.COLUMNS
        where TABLE_SCHEMA = '${this.database.options.database}'
          AND TABLE_NAME = '${this.collection.model.tableName}'
          AND column_name = '${this.columnName()}'
      `;
    } else {
      sql = `
        select column_name
        from INFORMATION_SCHEMA.COLUMNS
        where TABLE_NAME = '${this.collection.model.tableName}'
          AND column_name = '${this.columnName()}'
          AND table_schema = '${this.collection.collectionSchema() || 'public'}'
      `;
    }
    const [rows] = await this.database.sequelize.query(sql, opts);
    return rows.length > 0;
  }
  merge(obj) {
    Object.assign(this.options, obj);
  }
  bind() {
    const { model } = this.context.collection;
    model.rawAttributes[this.name] = this.toSequelize();
    // @ts-ignore
    model.refreshAttributes();
    if (this.options.index) {
      this.context.collection.addIndex([this.name]);
    }
    // setting field to be autoIncrement, should also update model`s autoIncrementAttribute
    // @ts-ignore
    if (this.options?.autoIncrement === true && !model.autoIncrementAttribute) {
      // @ts-ignore
      model._findAutoIncrementAttribute();
    }
  }
  unbind() {
    const { model } = this.context.collection;
    delete model.prototype[this.name];
    model.removeAttribute(this.name);
    if (this.options.index || this.options.unique) {
      this.context.collection.removeIndex([this.name]);
    }
  }
  toSequelize() {
    const opts = _.omit(this.options, ['name']);
    if (this.dataType) {
      // @ts-ignore
      Object.assign(opts, { type: this.database.sequelize.normalizeDataType(this.dataType) });
    }
    Object.assign(opts, this.additionalSequelizeOptions());
    return opts;
  }
  additionalSequelizeOptions() {
    return {};
  }
  typeToString() {
    return this.dataType.toString();
  }
}
//# sourceMappingURL=field.js.map
