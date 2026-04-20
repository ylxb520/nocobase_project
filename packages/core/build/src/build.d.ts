/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Package } from '@lerna/package';
import { PkgLog, UserConfig } from './utils';
export declare function build(pkgs: string[]): Promise<void>;
export declare function buildPackages(packages: Package[], targetDir: string, doBuildPackage: (cwd: string, userConfig: UserConfig, sourcemap: boolean, log?: PkgLog) => Promise<any>): Promise<void>;
export declare function buildPackage(pkg: Package, targetDir: string, doBuildPackage: (cwd: string, userConfig: UserConfig, sourcemap: boolean, log?: PkgLog) => Promise<any>): Promise<void>;
