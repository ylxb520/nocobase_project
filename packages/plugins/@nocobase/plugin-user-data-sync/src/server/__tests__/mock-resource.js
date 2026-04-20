/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { UserDataResource, } from '../user-data-resource-manager';
export class MockUsersResource extends UserDataResource {
    name = 'mock-users';
    accepts = ['user'];
    data = [];
    async update(record, resourcePks) {
        this.data[resourcePks[0]] = record.metaData;
        return [];
    }
    async create(record, matchKey) {
        this.data.push(record.metaData);
        return [{ resourcesPk: this.data.length - 1, isDeleted: false }];
    }
}
export class ErrorResource extends UserDataResource {
    async update(record, resourcePks) {
        return [];
    }
    async create(record, matchKey) {
        return [];
    }
}
//# sourceMappingURL=mock-resource.js.map