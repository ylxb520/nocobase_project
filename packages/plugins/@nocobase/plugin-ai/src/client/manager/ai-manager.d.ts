/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils/client';
import { ComponentType } from 'react';
import { ToolCall, WorkContextOptions } from '../ai-employees/types';
import { Application } from '@nocobase/client';
export type LLMProviderOptions = {
  components: {
    ProviderSettingsForm?: ComponentType;
    ModelSettingsForm?: ComponentType;
    MessageRenderer?: ComponentType<{
      msg: any;
    }>;
  };
  formatModelLabel?: (id: string) => string;
};
export type ToolOptions = {
  ui?: {
    card?: ComponentType<{
      messageId: string;
      tool: ToolCall<unknown>;
    }>;
    modal?: {
      title?: string;
      okText?: string;
      useOnOk?: () => {
        onOk: () => void | Promise<void>;
      };
      Component?: ComponentType<{
        tool: ToolCall<unknown>;
        saveToolArgs?: (args: unknown) => Promise<void>;
      }>;
    };
  };
  invoke?: (ctx: Application, params: any) => any | Promise<any>;
  useHooks?: () => ToolOptions;
};
export declare class AIManager {
  llmProviders: Registry<LLMProviderOptions>;
  chatSettings: Map<
    string,
    {
      title: string;
      Component: ComponentType;
    }
  >;
  workContext: Registry<WorkContextOptions>;
  registerLLMProvider(name: string, options: LLMProviderOptions): void;
  registerWorkContext(name: string, options: WorkContextOptions): void;
  getWorkContext(name: string): WorkContextOptions;
}
