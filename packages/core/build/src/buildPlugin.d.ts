/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PkgLog, UserConfig } from './utils';
export declare function deleteServerFiles(cwd: string, log: PkgLog): void;
export declare function writeExternalPackageVersion(cwd: string, log: PkgLog): void;
export declare function buildServerDeps(cwd: string, serverFiles: string[], log: PkgLog): Promise<void>;
export declare function buildPluginServer(cwd: string, userConfig: UserConfig, sourcemap: boolean, log: PkgLog): Promise<void>;
export declare function buildProPluginServer(cwd: string, userConfig: UserConfig, sourcemap: boolean, log: PkgLog): Promise<void>;
export declare function buildPluginClient(cwd: string, userConfig: any, sourcemap: boolean, log: PkgLog, isCommercial?: boolean): Promise<unknown>;
export declare function buildPlugin(cwd: string, userConfig: UserConfig, sourcemap: boolean, log: PkgLog): Promise<void>;
