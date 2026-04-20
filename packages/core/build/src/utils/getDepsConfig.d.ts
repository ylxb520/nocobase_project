/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare function winPath(path: string): string;
/**
 * get relative externals for specific pre-bundle pkg from other pre-bundle deps
 * @note  for example, "compiled/a" can be externalized in "compiled/b" as "../a"
 */
export declare function getRltExternalsFromDeps(depExternals: Record<string, string>, current: {
    name: string;
    outputDir: string;
}): Record<string, string>;
/**
 * get package.json path for specific NPM package
 */
export declare function getDepPkgPath(dep: string, cwd: string): string;
interface IDepPkg {
    nccConfig: {
        minify: boolean;
        target: string;
        quiet: boolean;
        externals: Record<string, string>;
    };
    depDir: string;
    pkg: Record<string, any>;
    outputDir: string;
    mainFile: string;
}
export declare function getDepsConfig(cwd: string, outDir: string, depsName: string[], external: string[]): Record<string, IDepPkg>;
export {};
