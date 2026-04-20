/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { fieldTypeMap } from '@nocobase/database';
import EventEmitter from 'events';
import lodash from 'lodash';
import { isArray } from 'mathjs';
import { typeInterfaceMap } from './type-interface-map';
export class DatabaseIntrospector extends EventEmitter {
  db;
  constructor(options) {
    super();
    this.db = options.db;
  }
  getFieldTypeMap() {
    return fieldTypeMap[this.db.sequelize.getDialect()];
  }
  getTypeInterfaceConfig(type) {
    return typeInterfaceMap[type] || {};
  }
  async getTableList() {
    return await this.db.sequelize.getQueryInterface().showAllTables();
  }
  async getTableColumnsInfo(tableInfo) {
    return this.db.sequelize.getQueryInterface().describeTable(tableInfo);
  }
  async getTableConstraints(tableInfo) {
    return this.db.sequelize.getQueryInterface().showIndex(tableInfo.tableName);
  }
  async getViewList() {
    return (await this.db.queryInterface.listViews()).map((view) => view.name);
  }
  excludeViewsOrTables() {
    return [];
  }
  async getTables(options = {}) {
    let tableList = await this.getTableList();
    const views = options.views?.length ? options.views : await this.getViewList();
    tableList = tableList.concat(views);
    tableList = tableList.filter((tableName) => {
      return !this.excludeViewsOrTables().includes(tableName);
    });
    if (this.db.options.tablePrefix) {
      tableList = tableList.filter((tableName) => {
        return tableName.startsWith(this.db.options.tablePrefix);
      });
    }
    return tableList;
  }
  async getCollection(options) {
    const { tableInfo, localOptions = {}, mergedOptions = {} } = options;
    const columnsInfo = await this.getTableColumnsInfo(tableInfo);
    const constraints = await this.getTableConstraints(tableInfo);
    const collectionOptions = this.tableInfoToCollectionOptions(tableInfo);
    try {
      const fields = Object.keys(columnsInfo).map((columnName) => {
        return this.columnInfoToFieldOptions(columnsInfo, columnName, constraints);
      });
      const unsupportedFields = fields.filter((field) => {
        // @ts-ignore
        return field.supported === false;
      });
      const supportFields = fields.filter((field) => {
        // @ts-ignore
        return field.supported !== false;
      });
      this.db.logger.debug('Processing collection fields', {
        tableName: tableInfo.tableName,
        totalFields: fields.length,
        supportedFields: supportFields.length,
        unsupportedFields: unsupportedFields.length,
      });
      const remoteCollectionInfo = {
        ...collectionOptions,
        ...this.collectionOptionsByFields(supportFields),
        ...localOptions,
        ...mergedOptions,
        fields: supportFields,
      };
      if (unsupportedFields.length) {
        remoteCollectionInfo.unsupportedFields = unsupportedFields;
        this.db.logger.debug('Found unsupported fields', {
          tableName: tableInfo.tableName,
          fields: unsupportedFields.map((f) => ({ name: f.name, type: f.rawType })),
        });
      }
      if (
        remoteCollectionInfo.view &&
        !remoteCollectionInfo.filterTargetKey &&
        supportFields.find((field) => field.name === 'id')
      ) {
        remoteCollectionInfo.filterTargetKey = 'id';
        this.db.logger.debug('Set view filterTargetKey to id', {
          tableName: tableInfo.tableName,
        });
      }
      return remoteCollectionInfo;
    } catch (e) {
      this.db.logger.error('Collection introspection error', {
        tableName: tableInfo.tableName,
        error: e.message,
        stack: e.stack,
      });
      throw new Error(`table ${tableInfo.tableName} introspection error: ${e.message}`, { cause: e });
    }
  }
  tableInfoToCollectionOptions(tableInfo) {
    const tableName = tableInfo.tableName;
    let name = tableName;
    if (this.db.options.tablePrefix) {
      name = tableName.replace(this.db.options.tablePrefix, '');
    }
    //replace dot to underscore
    name = name.replace(/\./g, '_');
    return {
      name,
      title: name,
      schema: tableInfo.schema,
      tableName,
    };
  }
  extractTypeFromDefinition(rawType) {
    const leftParenIndex = rawType.indexOf('(');
    if (leftParenIndex === -1) {
      return rawType.toLowerCase();
    }
    return rawType.substring(0, leftParenIndex).toLowerCase().trim();
  }
  inferFieldTypeByRawType(rawType) {
    const fieldTypeMap = this.getFieldTypeMap();
    const queryType = this.extractTypeFromDefinition(rawType);
    const mappedType = fieldTypeMap[queryType];
    if (isArray(mappedType)) {
      return {
        type: mappedType[0],
        possibleTypes: mappedType,
      };
    }
    return {
      type: mappedType,
    };
  }
  inferFieldOptionsByRawType(type, rawType) {
    const fieldClass = this.db.fieldTypes.get(type);
    if (!fieldClass) {
      return {};
    }
    if (typeof fieldClass.optionsFromRawType === 'function') {
      return fieldClass.optionsFromRawType(rawType);
    }
    return {};
  }
  columnInfoToFieldOptions(columnsInfo, columnName, indexes) {
    const columnInfo = columnsInfo[columnName];
    const name = columnName;
    let fieldOptions = {
      ...this.columnAttribute(columnsInfo, columnName, indexes),
      ...this.inferFieldTypeByRawType(columnInfo.type),
      rawType: columnInfo.type,
      name,
      field: columnName,
    };
    Object.assign(fieldOptions, this.inferFieldOptionsByRawType(fieldOptions.type, columnInfo.type));
    if (!fieldOptions.type) {
      return {
        rawType: columnInfo.type,
        name,
        field: columnName,
        supported: false,
      };
    }
    const interfaceConfig = this.getDefaultInterfaceByType(columnsInfo, columnName, fieldOptions.type);
    if (typeof interfaceConfig === 'string') {
      fieldOptions.interface = interfaceConfig;
    } else {
      fieldOptions = {
        ...fieldOptions,
        ...interfaceConfig,
      };
    }
    lodash.set(fieldOptions, 'uiSchema.title', columnName);
    return fieldOptions;
  }
  columnAttribute(columnsInfo, columnName, indexes) {
    const columnInfo = columnsInfo[columnName];
    const attr = {
      type: columnInfo.type,
      allowNull: columnInfo.defaultValue ? true : columnInfo.allowNull,
      primaryKey: columnInfo.primaryKey,
      unique: false,
      autoIncrement: columnInfo.autoIncrement,
      description: columnInfo.comment,
      elementType: columnInfo['elementType'],
    };
    if (columnInfo.defaultValue && typeof columnInfo.defaultValue === 'string') {
      const isSerial = columnInfo.defaultValue.match(/^nextval\(/);
      const isUUID = columnInfo.defaultValue.match(/^uuid_generate_v4\(/);
      if (isSerial || isUUID) {
        attr.autoIncrement = true;
      }
    }
    for (const index of indexes) {
      if (index.fields.length == 1 && index.fields[0].attribute == columnName && index.unique) {
        attr.unique = true;
      }
    }
    return attr;
  }
  collectionOptionsByFields(fields) {
    const options = {
      timestamps: false,
      autoGenId: false,
    };
    const autoIncrementField = fields.find((field) => field.autoIncrement);
    if (autoIncrementField) {
      options.filterTargetKey = autoIncrementField.name;
    }
    const primaryKeys = fields.filter((field) => field.primaryKey);
    if (primaryKeys.length > 1) {
      options.filterTargetKey = primaryKeys.map((field) => field.name);
    }
    if (!options.filterTargetKey && primaryKeys.length == 1) {
      options.filterTargetKey = primaryKeys[0].name;
    }
    const uniques = fields.filter((field) => field.unique);
    if (!options.filterTargetKey && uniques.length == 1) {
      options.filterTargetKey = uniques[0].name;
    }
    return options;
  }
  getDefaultInterfaceByType(columnsInfo, columnName, type) {
    const interfaceConfig = this.getTypeInterfaceConfig(type);
    let interfaceRes = interfaceConfig;
    if (typeof interfaceConfig === 'function') {
      interfaceRes = interfaceConfig(columnsInfo[columnName]);
    }
    return interfaceRes;
  }
}
//# sourceMappingURL=database-introspector.js.map
