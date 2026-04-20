/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare abstract class BaseStorage {
  storagePrefix: string;
  abstract clear(): void;
  abstract getItem(key: string): string | null;
  abstract removeItem(key: string): void;
  abstract setItem(key: string, value: string): void;
  toUpperCase(prefix?: string, ...arr: string[]): string;
}
export declare class MemoryStorage extends BaseStorage {
  items: Map<any, any>;
  clear(): void;
  getItem(key: string): any;
  setItem(key: string, value: string): Map<any, any>;
  removeItem(key: string): boolean;
}
export declare class LocalStorage extends BaseStorage {
  storagePrefix: string;
  baseStoragePrefix: string;
  shareToken: boolean;
  items: Storage;
  constructor(storagePrefix: string, baseStoragePrefix?: string, shareToken?: boolean);
  clear(): void;
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export declare class SessionStorage extends LocalStorage {
  storagePrefix: string;
  baseStoragePrefix: string;
  shareToken: boolean;
  constructor(storagePrefix: string, baseStoragePrefix?: string, shareToken?: boolean);
}
