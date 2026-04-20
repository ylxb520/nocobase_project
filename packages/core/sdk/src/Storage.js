/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class BaseStorage {
    storagePrefix;
    toUpperCase(prefix = '', ...arr) {
        return prefix.toUpperCase() + arr.map((str) => str.toUpperCase()).join('_');
    }
}
export class MemoryStorage extends BaseStorage {
    items = new Map();
    clear() {
        this.items.clear();
    }
    getItem(key) {
        return this.items.get(key);
    }
    setItem(key, value) {
        return this.items.set(key, value);
    }
    removeItem(key) {
        return this.items.delete(key);
    }
}
export class LocalStorage extends BaseStorage {
    storagePrefix;
    baseStoragePrefix;
    shareToken;
    items;
    constructor(storagePrefix, baseStoragePrefix = '', shareToken = false) {
        super();
        this.storagePrefix = storagePrefix;
        this.baseStoragePrefix = baseStoragePrefix;
        this.shareToken = shareToken;
        this.items = window.localStorage;
    }
    clear() {
        return this.items.clear();
    }
    getItem(key) {
        if (this.shareToken && key === 'token' && this.baseStoragePrefix) {
            return this.items.getItem(this.toUpperCase(this.baseStoragePrefix, key));
        }
        return this.items.getItem(this.toUpperCase(this.storagePrefix, key));
    }
    setItem(key, value) {
        if (this.shareToken && key === 'token' && this.baseStoragePrefix) {
            return this.items.setItem(this.toUpperCase(this.baseStoragePrefix, key), value);
        }
        return this.items.setItem(this.toUpperCase(this.storagePrefix, key), value);
    }
    removeItem(key) {
        if (this.shareToken && key === 'token' && this.baseStoragePrefix) {
            return this.items.removeItem(this.toUpperCase(this.baseStoragePrefix, key));
        }
        return this.items.removeItem(this.toUpperCase(this.storagePrefix, key));
    }
}
export class SessionStorage extends LocalStorage {
    storagePrefix;
    baseStoragePrefix;
    shareToken;
    constructor(storagePrefix, baseStoragePrefix = '', shareToken = false) {
        super(storagePrefix, baseStoragePrefix, shareToken);
        this.storagePrefix = storagePrefix;
        this.baseStoragePrefix = baseStoragePrefix;
        this.shareToken = shareToken;
        this.items = window.sessionStorage;
    }
}
//# sourceMappingURL=Storage.js.map