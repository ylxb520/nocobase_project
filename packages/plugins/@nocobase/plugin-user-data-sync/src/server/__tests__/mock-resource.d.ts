/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { OriginRecord, PrimaryKey, RecordResourceChanged, SyncAccept, UserDataResource } from '../user-data-resource-manager';
export declare class MockUsersResource extends UserDataResource {
    name: string;
    accepts: SyncAccept[];
    data: any[];
    update(record: OriginRecord, resourcePks: PrimaryKey[]): Promise<RecordResourceChanged[]>;
    create(record: OriginRecord, matchKey: string): Promise<RecordResourceChanged[]>;
}
export declare class ErrorResource extends UserDataResource {
    update(record: OriginRecord, resourcePks: PrimaryKey[]): Promise<RecordResourceChanged[]>;
    create(record: OriginRecord, matchKey: string): Promise<RecordResourceChanged[]>;
}
