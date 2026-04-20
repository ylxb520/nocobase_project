/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
type Log = (msg: string, ...args: any) => void;
export declare function isNotBuiltinModule(packageName: string): boolean;
export declare const isValidPackageName: (str: string) => boolean;
/**
 * get package name from string
 * @example
 * getPackageNameFromString('lodash') => lodash
 * getPackageNameFromString('lodash/xx') => lodash
 * getPackageNameFromString('@aa/bb') => @aa/bb
 * getPackageNameFromString('aa/${lang}') => aa
 *
 * getPackageNameFromString('./xx') => null
 * getPackageNameFromString('../xx') => null
 * getPackageNameFromString($file) => null
 * getPackageNameFromString(`${file}`) => null
 * getPackageNameFromString($file + './xx') => null
 */
export declare function getPackageNameFromString(str: string): string;
export declare function getPackagesFromFiles(files: string[]): string[];
export declare function getSourcePackages(fileSources: string[]): string[];
export declare function getIncludePackages(sourcePackages: string[], external: string[], pluginPrefix: string[]): string[];
export declare function getExcludePackages(sourcePackages: string[], external: string[], pluginPrefix: string[]): string[];
export declare function getPackageJsonPackages(packageJson: Record<string, any>): string[];
export declare function checkEntryExists(cwd: string, entry: 'server' | 'client', log: Log): string;
export declare function checkDependencies(packageJson: Record<string, any>, log: Log): void;
type CheckOptions = {
    cwd: string;
    log: Log;
    entry: 'server' | 'client';
    files: string[];
    packageJson: Record<string, any>;
};
export declare function getFileSize(filePath: string): number;
export declare function formatFileSize(fileSize: number): string;
export declare function buildCheck(options: CheckOptions): void;
export declare function checkRequire(sourceFiles: string[], log: Log): void;
export declare function checkFileSize(outDir: string, log: Log): void;
export {};
