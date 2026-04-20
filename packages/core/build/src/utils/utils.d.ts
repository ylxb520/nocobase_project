/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Options as TsupConfig } from 'tsup';
import { InlineConfig as ViteConfig } from 'vite';
export type PkgLog = (msg: string, ...args: any[]) => void;
export declare const getPkgLog: (pkgName: string) => PkgLog;
export declare function toUnixPath(filepath: string): string;
export declare function getPackageJson(cwd: string): any;
export interface UserConfig {
    modifyTsupConfig?: (config: TsupConfig) => TsupConfig;
    modifyViteConfig?: (config: ViteConfig) => ViteConfig;
    beforeBuild?: (log: PkgLog) => void | Promise<void>;
    afterBuild?: (log: PkgLog) => void | Promise<void>;
}
export declare function defineConfig(config: UserConfig): UserConfig;
export declare function getUserConfig(cwd: string): UserConfig;
export declare function writeToCache(key: string, data: Record<string, any>): void;
export declare function readFromCache(key: string): any;
export declare function getEnvDefine(): {
    'process.env.NODE_ENV': string;
    'process.env.__TEST__': boolean;
    'process.env.__E2E__': boolean;
    'process.env.APP_ENV': string;
};
