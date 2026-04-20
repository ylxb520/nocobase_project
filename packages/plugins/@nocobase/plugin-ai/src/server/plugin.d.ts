/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/server';
import { AIManager } from './manager/ai-manager';
import { AIPluginFeatureManagerImpl } from './manager/ai-feature-manager';
import { AIEmployeesManager } from './ai-employees/ai-employees-manager';
import Snowflake from './snowflake';
import { BuiltInManager } from './manager/built-in-manager';
import { AIContextDatasourceManager } from './manager/ai-context-datasource-manager';
import { AICodingManager } from './manager/ai-coding-manager';
export declare class PluginAIServer extends Plugin {
  features: AIPluginFeatureManagerImpl;
  aiManager: AIManager;
  aiEmployeesManager: AIEmployeesManager;
  builtInManager: BuiltInManager;
  aiContextDatasourceManager: AIContextDatasourceManager;
  aiCodingManager: AICodingManager;
  workContextHandler: import('./types').WorkContextHandler;
  snowflake: Snowflake;
  /**
   * Check if the AI employee is a builder/admin-only type (e.g., Nathan, Orin).
   * These employees have powerful capabilities (coding, schema modification) and should be restricted to admins.
   */
  isBuilderAI(username: string): boolean;
  afterAdd(): Promise<void>;
  beforeLoad(): Promise<void>;
  load(): Promise<void>;
  setupBuiltIn(): Promise<void>;
  registerLLMProviders(): void;
  registerTools(): void;
  defineResources(): void;
  setPermissions(): void;
  registerWorkflow(): void;
  registerWorkContextResolveStrategy(): void;
  handleSyncMessage(message: any): Promise<void>;
  install(): Promise<void>;
  upgrade(): Promise<void>;
  afterEnable(): Promise<void>;
  afterDisable(): Promise<void>;
  remove(): Promise<void>;
  get repositories(): {
    aiContextDatasources: import('@nocobase/database').Repository<any, any>;
  };
  private repository;
}
export default PluginAIServer;
