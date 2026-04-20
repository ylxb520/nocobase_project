/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { CreateServerOptions, CreateTableOptions, RemoteLocalBridge } from './remote-local-bridge';
export declare class MySQLToMySQLBridge extends RemoteLocalBridge {
    createServer(options: CreateServerOptions): Promise<void>;
    createTable(options: CreateTableOptions): Promise<void>;
}
