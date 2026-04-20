/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
import { Context } from '@nocobase/actions';
export interface AIToolRegister {
  registerToolGroup(options: ToolGroupRegisterOptions): any;
  registerDynamicTool(delegate: ToolRegisterDelegate): any;
  registerTools<T>(options: ToolRegisterOptions | ToolRegisterOptions[]): any;
  getTool(name: string, raw?: boolean): Promise<ToolOptions>;
  listTools(): Promise<
    {
      group: ToolGroupRegisterOptions;
      tools: ToolOptions[];
    }[]
  >;
}
export interface ToolOptions {
  title: string;
  description: string;
  execution?: 'frontend' | 'backend';
  name: string;
  schema?: any;
  invoke: (
    ctx: Context,
    args: Record<string, any>,
    id: string,
  ) => Promise<{
    status: 'success' | 'error';
    content: string;
  }>;
  [key: string]: unknown;
}
export type ToolRegisterOptions = {
  groupName?: string;
  tool: ToolOptions;
};
export type ToolGroupRegisterOptions = {
  groupName: string;
  title?: string;
  description?: string;
  sort?: number;
};
export type ToolRegisterDelegate = {
  groupName: string;
  getTools: () => Promise<ToolRegisterOptions[]>;
};
export declare class ToolManager implements AIToolRegister {
  tools: Registry<ToolRegisterOptions>;
  groups: Registry<ToolGroupRegisterOptions>;
  delegates: ToolRegisterDelegate[];
  constructor();
  registerToolGroup(options: ToolGroupRegisterOptions): void;
  registerDynamicTool(delegate: ToolRegisterDelegate): void;
  registerTools<T>(options: ToolRegisterOptions | ToolRegisterOptions[]): void;
  getTool(name: string, raw?: boolean): Promise<ToolOptions>;
  listTools(raw?: boolean): Promise<
    {
      group: ToolGroupRegisterOptions;
      tools: ToolOptions[];
    }[]
  >;
  private _getTool;
  private processSchema;
  private checkGroupName;
}
