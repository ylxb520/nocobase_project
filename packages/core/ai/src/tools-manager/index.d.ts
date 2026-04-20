/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
import { DynamicToolsProvider, ToolsEntry, ToolsFilter, ToolsManager, ToolsOptions } from './types';
export declare class DefaultToolsManager implements ToolsManager {
  private readonly tools;
  private readonly dynamicTools;
  constructor(tools?: Registry<ToolsOptions>, dynamicTools?: DynamicToolsProvider[]);
  getTools(toolName: string): Promise<ToolsEntry>;
  listTools(filter?: ToolsFilter): Promise<ToolsEntry[]>;
  registerTools(options: ToolsOptions | ToolsOptions[]): void;
  registerDynamicTools(provider: DynamicToolsProvider): void;
  private getToolsList;
  private syncDynamicTools;
}
export declare function defineTools(options: ToolsOptions): ToolsOptions;
export * from './types';
