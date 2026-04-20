/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PkgLog, UserConfig } from './utils';
export declare function buildClient(cwd: string, userConfig: UserConfig, sourcemap: boolean, log: PkgLog): Promise<void>;
export declare function buildLocale(cwd: string, userConfig: UserConfig, log: PkgLog): Promise<void>;
