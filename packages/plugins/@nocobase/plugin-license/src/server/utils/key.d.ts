/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Context } from 'koa';
import { KeyData } from './interface';
export declare function request({ url, method, body, headers, timeout, }: {
    url: string;
    method?: string;
    body?: Record<string, any>;
    headers?: any;
    timeout?: number;
}, ctx?: Context): Promise<any>;
export declare function saveLicenseKey(licenseKey: string, ctx?: any): Promise<void>;
export declare function getLocalKeyData(): Promise<any>;
export declare function getKey(ctx?: Context): Promise<string>;
export declare function getLicenseStatus(keyData: KeyData): Promise<'active' | 'invalid'>;
export declare function parseKey(key: string): KeyData;
export declare function getKeyInfo(ctx?: Context): Promise<KeyData>;
export declare function isDateExpired(upgradeExpirationDate: string): boolean;
