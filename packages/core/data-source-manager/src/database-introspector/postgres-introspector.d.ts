/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DatabaseIntrospector } from './database-introspector';
import { ColumnsDescription } from 'sequelize';
import { tableInfo } from '../types';
export declare class PostgresIntrospector extends DatabaseIntrospector {
    getTableConstraints(tableInfo: tableInfo): Promise<object>;
    getTableColumnsInfo(tableInfo: tableInfo): Promise<ColumnsDescription>;
    private getPrimaryKeysOfTable;
    protected columnAttribute(columnsInfo: ColumnsDescription, columnName: string, indexes: any): any;
    private getArrayColumnElementType;
    private appendArrayColumnElementType;
}
