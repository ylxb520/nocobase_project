/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import Database, { MagicAttributeModel, Transactionable } from '@nocobase/database';
import { Application } from '@nocobase/server';
type TableInfo = {
  tableName: string;
  schema?: string;
};
export declare class DatabaseServerModel extends MagicAttributeModel {
  protected app: Application;
  setApp(app: Application): void;
  renderJsonTemplate(options: any): any;
  getRemoteDatabaseInstance(): Database;
  getOptions(): any;
  listRemoteTables(): Promise<[unknown[], unknown]>;
  describeTable(table: TableInfo): Promise<import('sequelize').ColumnsDescription>;
  showIndexes(table: TableInfo): Promise<object>;
  showTableDefinition(tableInfo: TableInfo): Promise<any>;
  updateServer(options?: Transactionable): Promise<void>;
  destroyServer(options?: Transactionable): Promise<void>;
  createServer(options?: Transactionable): Promise<void>;
}
export {};
