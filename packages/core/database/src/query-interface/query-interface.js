/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export default class QueryInterface {
  db;
  sequelizeQueryInterface;
  constructor(db) {
    this.db = db;
    this.sequelizeQueryInterface = db.sequelize.getQueryInterface();
  }
  async dropAll(options) {
    if (options.drop !== true) return;
    const views = await this.listViews();
    for (const view of views) {
      let removeSql;
      if (view.schema) {
        removeSql = `DROP VIEW IF EXISTS "${view.schema}"."${view.name}"`;
      } else {
        removeSql = `DROP VIEW IF EXISTS ${view.name}`;
      }
      try {
        await this.db.sequelize.query(removeSql, { transaction: options.transaction });
      } catch (e) {
        console.log(`can not drop view ${view.name}, ${e.message}`);
      }
    }
    await this.db.sequelize.getQueryInterface().dropAllTables(options);
  }
  quoteIdentifier(identifier) {
    // @ts-ignore
    return this.db.sequelize.getQueryInterface().queryGenerator.quoteIdentifier(identifier);
  }
  generateJoinOnForJSONArray(left, right) {
    const dialect = this.db.sequelize.getDialect();
    throw new Error(`Filtering by many to many (array) associations is not supported on ${dialect}`);
  }
}
//# sourceMappingURL=query-interface.js.map
