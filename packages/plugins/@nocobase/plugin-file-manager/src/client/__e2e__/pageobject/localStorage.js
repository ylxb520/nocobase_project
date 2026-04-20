/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class CreateLocalStorage {
    page;
    title;
    storageName;
    storagebaseURL;
    destination;
    path;
    defaultStorage;
    deleteRecordRetentionFile;
    constructor(page) {
        this.page = page;
        this.title = page.getByLabel('block-item-CollectionField-storages-Title').getByRole('textbox');
        this.storageName = page.getByLabel('block-item-CollectionField-storages-Storage name').getByRole('textbox');
        // this.storagebaseURL = page.getByLabel('block-item-CollectionField-storages-Storage base URL').getByRole('textbox');
        // this.destination = page.getByLabel('block-item-Input-storages-Destination').getByRole('textbox');
        this.path = page.getByLabel('block-item-CollectionField-storages-Path').getByRole('textbox');
        this.defaultStorage = page.getByLabel('Default storage');
        this.deleteRecordRetentionFile = page.getByLabel('Keep file in storage when destroy record');
    }
}
export class EditLocalStorage {
    page;
    title;
    storageName;
    storagebaseURL;
    storageType;
    destination;
    path;
    defaultStorage;
    deleteRecordRetentionFile;
    constructor(page) {
        this.page = page;
        this.title = page.getByLabel('block-item-CollectionField-storages-Title').getByRole('textbox');
        this.storageName = page.getByLabel('block-item-CollectionField-storages-Storage name').getByRole('textbox');
        // this.storagebaseURL = page.getByLabel('block-item-CollectionField-storages-Storage base URL').getByRole('textbox');
        // this.destination = page.getByLabel('block-item-Input-storages-Destination').getByRole('textbox');
        this.path = page.getByLabel('block-item-CollectionField-storages-Path').getByRole('textbox');
        this.defaultStorage = page.getByLabel('Default storage');
        this.deleteRecordRetentionFile = page.getByLabel('Keep file in storage when destroy record');
    }
}
//# sourceMappingURL=localStorage.js.map