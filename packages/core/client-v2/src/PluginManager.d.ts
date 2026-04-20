/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { Application } from './Application';
import type { Plugin } from './Plugin';
export type PluginOptions<T = any> = {
  name?: string;
  packageName?: string;
  config?: T;
};
export type PluginType<Opts = any> = typeof Plugin | [typeof Plugin<Opts>, PluginOptions<Opts>];
export type PluginData = {
  name: string;
  packageName: string;
  version: string;
  url: string;
  type: 'local' | 'upload' | 'npm';
};
export declare class PluginManager {
  protected _plugins: PluginType[];
  protected loadRemotePlugins: boolean;
  protected app: Application;
  protected pluginInstances: Map<typeof Plugin, Plugin>;
  protected pluginsAliases: Record<string, Plugin>;
  private initPlugins;
  constructor(_plugins: PluginType[], loadRemotePlugins: boolean, app: Application);
  /**
   * @internal
   */
  init(_plugins: PluginType[]): Promise<void>;
  private initStaticPlugins;
  private initRemotePlugins;
  add<T = any>(plugin: typeof Plugin, opts?: PluginOptions<T>): Promise<void>;
  get<T extends typeof Plugin>(PluginClass: T): InstanceType<T>;
  get<T extends {}>(name: string): T;
  private getInstance;
  /**
   * @internal
   */
  load(): Promise<void>;
}
