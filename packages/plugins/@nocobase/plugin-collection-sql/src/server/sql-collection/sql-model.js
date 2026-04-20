/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model, sqlParser } from '@nocobase/database';
import { selectQuery } from './query-generator';
export class SQLModel extends Model {
  static sql;
  static get queryInterface() {
    const queryInterface = this.sequelize.getQueryInterface();
    const queryGenerator = queryInterface.queryGenerator;
    const sqlGenerator = new Proxy(queryGenerator, {
      get(target, prop) {
        if (prop === 'selectQuery') {
          return selectQuery.bind(target);
        }
        return Reflect.get(target, prop);
      },
    });
    return new Proxy(queryInterface, {
      get(target, prop) {
        if (prop === 'queryGenerator') {
          return sqlGenerator;
        }
        return Reflect.get(target, prop);
      },
    });
  }
  static async sync() {}
  static getTableNameWithSchema(table) {
    if (this.database.inDialect('postgres') && !table.includes('.')) {
      const schema = process.env.DB_SCHEMA || 'public';
      return `${schema}.${table}`;
    }
    return table;
  }
  static parseSelectAST(ast) {
    const tablesMap = {}; // table => columns
    const tableAliases = {};
    ast.from.forEach((fromItem) => {
      tablesMap[fromItem.table] = [];
      if (fromItem.as) {
        tableAliases[fromItem.as] = fromItem.table;
      }
    });
    ast.columns.forEach((column) => {
      const expr = column.expr;
      if (expr.type !== 'column_ref') {
        return;
      }
      const table = expr.table;
      const name = tableAliases[table] || table;
      const columnAttr = { name: expr.column, as: column.as };
      if (!name) {
        Object.keys(tablesMap).forEach((n) => {
          tablesMap[n].push(columnAttr);
        });
      } else if (tablesMap[name]) {
        tablesMap[name].push(columnAttr);
      }
    });
    return tablesMap;
  }
  static parseTablesAndColumns() {
    let { ast: _ast } = sqlParser.parse(this.sql);
    if (Array.isArray(_ast)) {
      _ast = _ast[0];
    }
    const ast = _ast;
    ast.from = ast.from || [];
    ast.columns = ast.columns || [];
    if (ast.with) {
      // The type definition of the AST is not accurate in node-sql-parser 4.18.0
      // So we need to use any here temporarily
      const withAST = ast.with;
      withAST.forEach((withItem) => {
        const as = withItem.name.value;
        const withAst = withItem.stmt.ast;
        ast.from.push(...withAst.from.map((f) => ({ ...f, as })));
        ast.columns.push(
          ...withAst.columns.map((c) => ({
            ...c,
            expr: {
              ...c.expr,
              table: as,
            },
          })),
        );
      });
    }
    const tablesMap = this.parseSelectAST(ast);
    return Object.entries(tablesMap)
      .filter(([_, columns]) => columns)
      .map(([table, columns]) => ({ table, columns }));
  }
  static inferFields() {
    const tables = this.parseTablesAndColumns();
    return tables.reduce((fields, { table, columns }) => {
      const tableName = this.getTableNameWithSchema(table);
      const collection = this.database.tableNameCollectionMap.get(tableName);
      if (!collection) {
        const originFields = {};
        columns.forEach((column) => {
          if (column.name === '*') {
            return;
          }
          originFields[column.as || column.name] = {};
        });
        return { ...fields, ...originFields };
      }
      const all = columns.some((column) => column.name === '*');
      const attributes = collection.model.getAttributes();
      const sourceFields = {};
      if (all) {
        Object.values(attributes).forEach((attribute) => {
          const field = collection.getField(attribute.fieldName);
          if (!field?.options.interface) {
            return;
          }
          sourceFields[field.name] = {
            collection: field.collection.name,
            type: field.type,
            source: `${field.collection.name}.${field.name}`,
            interface: field.options.interface,
            uiSchema: field.options.uiSchema,
          };
        });
      } else {
        columns.forEach((column) => {
          let options = {};
          const modelField = Object.values(attributes).find((attribute) => attribute.field === column.name);
          if (modelField) {
            const field = collection.getField(modelField.fieldName);
            if (field?.options.interface) {
              options = {
                collection: field.collection.name,
                type: field.type,
                source: `${field.collection.name}.${field.name}`,
                interface: field.options.interface,
                uiSchema: field.options.uiSchema,
              };
            }
          }
          sourceFields[column.as || column.name] = options;
        });
      }
      return { ...fields, ...sourceFields };
    }, {});
  }
}
//# sourceMappingURL=sql-model.js.map
