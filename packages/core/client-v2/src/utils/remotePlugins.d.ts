/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { DevDynamicImport } from '../Application';
import type { Plugin } from '../Plugin';
import type { PluginData } from '../PluginManager';
import type { RequireJS } from './requirejs';
/**
 * @internal
 */
export declare function defineDevPlugins(plugins: Record<string, typeof Plugin>): void;
/**
 * @internal
 */
export declare function definePluginClient(packageName: string): void;
/**
 * @internal
 */
export declare function configRequirejs(requirejs: any, pluginData: PluginData[]): void;
/**
 * @internal
 */
export declare function processRemotePlugins(
  pluginData: PluginData[],
  resolve: (plugins: [string, typeof Plugin][]) => void,
): (
  ...pluginModules: (typeof Plugin & {
    default?: typeof Plugin;
  })[]
) => void;
/**
 * @internal
 */
export declare function getRemotePlugins(
  requirejs: any,
  pluginData?: PluginData[],
): Promise<Array<[string, typeof Plugin]>>;
interface GetPluginsOption {
  requirejs: RequireJS;
  pluginData: PluginData[];
  devDynamicImport?: DevDynamicImport;
}
/**
 * @internal
 */
export declare function getPlugins(options: GetPluginsOption): Promise<Array<[string, typeof Plugin]>>;
export {};
