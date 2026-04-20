/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { KeyData } from './interface';
export interface PluginData {
    name: string;
    packageName: string;
    status: string;
    expirationDate: string;
    enabled: boolean;
    installed: boolean;
}
export declare function getPlugins({ keyData, ctx }: {
    keyData: KeyData;
    ctx: any;
}): Promise<PluginData[]>;
export declare function getPluginsLicenseStatus({ plugins }: {
    plugins: PluginData[];
}): boolean;
