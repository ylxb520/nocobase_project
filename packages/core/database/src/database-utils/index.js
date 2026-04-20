/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
export default class DatabaseUtils {
  db;
  constructor(db) {
    this.db = db;
  }
  addSchema(tableName, schema) {
    if (!this.db.inDialect('postgres')) return tableName;
    if (this.db.options.schema && !schema) {
      schema = this.db.options.schema;
    }
    if (schema) {
      // @ts-ignore
      tableName = this.db.sequelize.getQueryInterface().queryGenerator.addSchema({
        tableName,
        _schema: schema,
      });
    }
    return tableName;
  }
  quoteTable(tableName) {
    const queryGenerator = this.db.sequelize.getQueryInterface().queryGenerator;
    // @ts-ignore
    tableName = queryGenerator.quoteTable(lodash.isPlainObject(tableName) ? tableName : this.addSchema(tableName));
    return tableName;
  }
  schema() {
    if (!this.db.inDialect('postgres')) {
      return undefined;
    }
    return this.db.options.schema || 'public';
  }
}
//# sourceMappingURL=index.js.map
