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
import { Database, Model } from '@nocobase/database';
import { Transactionable } from 'sequelize';
type RemoteDialect = 'postgres' | 'mysql' | 'mariadb';
export type TableInfo = {
  schema?: string;
  tableName: string;
};
export type CreateServerOptions = {
  serverName: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
} & Transactionable;
export type CreateTableOptions = {
  remoteServerName: string;
  remoteTableDefinition: string;
  remoteTableInfo: TableInfo;
  localModel: typeof Model;
} & Transactionable;
export declare const REPLACE_TABLE_NAME_REGEX: RegExp;
export declare abstract class RemoteLocalBridge {
  protected localDatabase: Database;
  protected remoteDatabase: Database;
  constructor(localDatabase: Database, remoteDatabase: Database);
  abstract createServer(options: CreateServerOptions): Promise<void>;
  abstract createTable(options: CreateTableOptions): Promise<void>;
  protected replaceTableName(sql: string, tableName: string): string;
}
interface CreateBridgeOptions {
  remoteDatabase: Database;
  localDatabase: Database;
}
export declare class RemoteLocalBridgeFactory {
  static bridges: Map<string, typeof RemoteLocalBridge>;
  static getKeyOfTuple(remoteDialect: RemoteDialect, localDialect: RemoteDialect): string;
  static createBridge(options: CreateBridgeOptions): RemoteLocalBridge;
  static registerBridge(
    remoteDialect: RemoteDialect,
    localDialect: RemoteDialect,
    bridge: typeof RemoteLocalBridge,
  ): void;
}
export {};
