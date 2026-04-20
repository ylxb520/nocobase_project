/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="node" />
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { Database } from '@nocobase/database';
import EventEmitter from 'events';
import { ColumnsDescription } from 'sequelize';
import { CollectionOptions, FieldInferResult, PartialCollectionOptions, tableInfo } from '../types';
type GetCollectionOptions = {
  tableInfo: tableInfo;
  localOptions?: PartialCollectionOptions;
  mergedOptions?: PartialCollectionOptions;
};
interface DatabaseIntrospectorOptions {
  db: Database;
  typeInterfaceMap?: any;
}
export declare class DatabaseIntrospector extends EventEmitter {
  db: Database;
  constructor(options: DatabaseIntrospectorOptions);
  protected getFieldTypeMap(): Record<string, string | Array<string>>;
  protected getTypeInterfaceConfig(type: string): Record<string, any>;
  getTableList(): Promise<string[]>;
  getTableColumnsInfo(tableInfo: tableInfo): Promise<ColumnsDescription>;
  getTableConstraints(tableInfo: tableInfo): Promise<object>;
  getViewList(): Promise<any>;
  excludeViewsOrTables(): any[];
  getTables(options?: any): Promise<string[]>;
  getCollection(options: GetCollectionOptions): Promise<CollectionOptions>;
  tableInfoToCollectionOptions(tableInfo: tableInfo): {
    name: string;
    title: string;
    schema: string;
    tableName: string;
  };
  protected extractTypeFromDefinition(rawType: string): string;
  protected inferFieldTypeByRawType(rawType: string): any;
  protected inferFieldOptionsByRawType(type: string, rawType: string): any;
  protected columnInfoToFieldOptions(
    columnsInfo: ColumnsDescription,
    columnName: string,
    indexes: any,
  ): FieldInferResult;
  protected columnAttribute(columnsInfo: ColumnsDescription, columnName: string, indexes: any): any;
  private collectionOptionsByFields;
  private getDefaultInterfaceByType;
}
export {};
