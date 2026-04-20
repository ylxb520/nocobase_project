/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { TFuncKey, TOptions } from 'i18next';
import type { Application } from './Application';
export declare class Plugin<T = any> {
  options: T;
  protected app: Application;
  constructor(options: T, app: Application);
  get pluginManager(): import('./PluginManager').PluginManager;
  get context(): import('@nocobase/flow-engine').FlowEngineContext & {
    pluginSettingsRouter: import('./PluginSettingsManager').PluginSettingsManager;
    pluginManager: import('./PluginManager').PluginManager;
  };
  get flowEngine(): import('@nocobase/flow-engine').FlowEngine;
  get engine(): import('@nocobase/flow-engine').FlowEngine;
  get pm(): import('./PluginManager').PluginManager;
  get router(): import('./RouterManager').RouterManager;
  get pluginSettingsManager(): import('./PluginSettingsManager').PluginSettingsManager;
  get pluginSettingsRouter(): import('./PluginSettingsManager').PluginSettingsManager;
  get schemaInitializerManager(): any;
  get schemaSettingsManager(): any;
  get dataSourceManager(): any;
  afterAdd(): Promise<void>;
  beforeLoad(): Promise<void>;
  load(): Promise<void>;
  t(text: TFuncKey | TFuncKey[], options?: TOptions): import('i18next').TFunctionDetailedResult<object>;
}
