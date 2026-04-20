/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DatabaseIntrospector } from './database-introspector/database-introspector';
import { PostgresIntrospector } from './database-introspector/postgres-introspector';
import { MariaDBIntrospector } from './database-introspector/mariadb-introspector';
import { DataSource } from './data-source';
export class DatabaseDataSource extends DataSource {
  createDatabaseIntrospector(db) {
    if (db.isPostgresCompatibleDialect()) {
      return new PostgresIntrospector({
        db,
      });
    }
    const dialect = db.sequelize.getDialect();
    switch (dialect) {
      case 'mariadb':
        return new MariaDBIntrospector({
          db,
        });
      default:
        return new DatabaseIntrospector({
          db,
        });
    }
  }
  mergeWithLoadedCollections(collections, loadedCollections) {
    return collections.map((collection) => {
      const loadedCollection = loadedCollections[collection.name];
      if (!loadedCollection) return collection;
      const collectionFields = collection.fields || [];
      const loadedFieldsObj = Object.fromEntries(
        (loadedCollection.fields || []).map((f) => [f.columnName || f.field || f.name, f]),
      );
      // Merge existing fields
      const newFields = collectionFields.map((field) => {
        const loadedField = loadedFieldsObj[field.name];
        if (!loadedField) return field;
        if (loadedField.possibleTypes) {
          loadedField.possibleTypes = field.possibleTypes;
        }
        return this.mergeFieldOptions(field, loadedField);
      });
      // Add association fields from loaded data
      const loadedAssociationFields = (loadedCollection.fields || []).filter((field) =>
        ['belongsTo', 'belongsToMany', 'hasMany', 'hasOne', 'belongsToArray'].includes(field.type),
      );
      newFields.push(...loadedAssociationFields);
      return {
        ...collection,
        ...Object.fromEntries(Object.entries(loadedCollection).filter(([key]) => key !== 'fields')),
        fields: newFields,
      };
    });
  }
  mergeFieldOptions(fieldOptions, modelOptions) {
    const newOptions = {
      ...fieldOptions,
      ...modelOptions,
    };
    if (fieldOptions.rawType && modelOptions.rawType && fieldOptions.rawType !== modelOptions.rawType) {
      newOptions.type = fieldOptions.type;
      newOptions.interface = fieldOptions.interface;
      newOptions.rawType = fieldOptions.rawType;
    }
    for (const key of [...new Set([...Object.keys(modelOptions), ...Object.keys(fieldOptions)])]) {
      if (modelOptions[key] === null && fieldOptions[key]) {
        newOptions[key] = fieldOptions[key];
      }
    }
    return newOptions;
  }
}
//# sourceMappingURL=database-data-source.js.map
