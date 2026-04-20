/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  LLMProvider,
  LLMProviderOptions,
  EmbeddingProvider,
  EmbeddingProviderOptions,
} from '../llm-providers/provider';
import PluginAIServer from '../plugin';
import { ToolManager } from './tool-manager';
export type LLMProviderMeta = {
  title: string;
  supportedModel?: SupportedModel[];
  models?: Partial<Record<SupportedModel, string[]>>;
  provider: new (opts: LLMProviderOptions) => LLMProvider;
  embedding?: new (opts: EmbeddingProviderOptions) => EmbeddingProvider;
  supportWebSearch?: boolean;
};
export declare enum SupportedModel {
  LLM = 'LLM',
  EMBEDDING = 'EMBEDDING',
}
export declare class AIManager {
  protected plugin: PluginAIServer;
  llmProviders: Map<string, LLMProviderMeta>;
  toolManager: ToolManager;
  constructor(plugin: PluginAIServer);
  registerLLMProvider(name: string, meta: LLMProviderMeta): void;
  listLLMProviders(): {
    name: string;
    title: string;
    supportedModel: SupportedModel[];
    supportWebSearch: boolean;
  }[];
  getSupportedProvider(model: SupportedModel): string[];
}
