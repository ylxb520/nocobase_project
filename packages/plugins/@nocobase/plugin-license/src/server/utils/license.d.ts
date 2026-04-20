/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Env } from '@nocobase/license-kit';
import { KeyData } from './interface';
import { PluginData } from './plugin';
export interface LicenseValidateResult {
    current: {
        env: Env;
        domain: string;
    };
    dbMatch: boolean;
    sysMatch: boolean;
    envMatch: boolean;
    domainMatch: boolean;
    isExpired: boolean;
    isServiceConnection: boolean;
    isPkgLogin: boolean;
    keyData: KeyData;
    pkgUrl: string;
    licenseStatus: 'active' | 'invalid';
    pluginsLicensed: boolean;
    plugins: PluginData[];
    keyStatus?: 'invalid' | 'notfound';
}
export declare function getLicenseValidate({ key, ctx }: {
    key?: string;
    ctx?: any;
}): Promise<LicenseValidateResult>;
