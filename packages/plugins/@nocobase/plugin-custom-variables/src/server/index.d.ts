/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { InstallOptions, Plugin } from '@nocobase/server';
export declare class PluginCustomVariablesServer extends Plugin {
  afterAdd(): void;
  load(): Promise<void>;
  install(options?: InstallOptions): Promise<void>;
  afterEnable(): Promise<void>;
  afterDisable(): Promise<void>;
  remove(): Promise<void>;
}
export default PluginCustomVariablesServer;
