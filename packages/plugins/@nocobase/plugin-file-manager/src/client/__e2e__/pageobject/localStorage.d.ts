/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { Locator, Page } from '@nocobase/test/e2e';
export declare class CreateLocalStorage {
    readonly page: Page;
    title: Locator;
    storageName: Locator;
    storagebaseURL: Locator;
    destination: Locator;
    path: Locator;
    defaultStorage: Locator;
    deleteRecordRetentionFile: Locator;
    constructor(page: Page);
}
export declare class EditLocalStorage {
    readonly page: Page;
    title: Locator;
    storageName: Locator;
    storagebaseURL: Locator;
    storageType: Locator;
    destination: Locator;
    path: Locator;
    defaultStorage: Locator;
    deleteRecordRetentionFile: Locator;
    constructor(page: Page);
}
