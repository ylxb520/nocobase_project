/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
import { Plugin } from '@nocobase/client';
import { AIManager } from './manager/ai-manager';
import { AIPluginFeatureManagerImpl } from './manager/ai-feature-manager';
import './ai-employees/flow/events';
declare const Chat: import('react').FC<{}>;
declare const ModelSelect: import('react').FC<{}>;
export declare class PluginAIClient extends Plugin {
  features: AIPluginFeatureManagerImpl;
  aiManager: AIManager;
  afterAdd(): Promise<void>;
  beforeLoad(): Promise<void>;
  load(): Promise<void>;
  addPluginSettings(): void;
  setupAIFeatures(): Promise<void>;
  setupWorkflow(): void;
}
export default PluginAIClient;
export { ModelSelect, Chat };
export type { LLMProviderOptions, ToolOptions } from './manager/ai-manager';
export type { AIEmployee, ToolCall } from './ai-employees/types';
export * from './features';
export { AIEmployeeActionModel } from './ai-employees/flow/models/AIEmployeeActionModel';
export { useChatMessagesStore } from './ai-employees/chatbox/stores/chat-messages';
export { useChatBoxStore } from './ai-employees/chatbox/stores/chat-box';
export { useChatBoxActions } from './ai-employees/chatbox/hooks/useChatBoxActions';
export { useAIConfigRepository } from './repositories/hooks/useAIConfigRepository';
export { ProfileCard } from './ai-employees/ProfileCard';
export { avatars } from './ai-employees/avatars';
