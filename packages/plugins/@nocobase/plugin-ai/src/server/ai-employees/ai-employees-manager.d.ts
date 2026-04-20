/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import PluginAIServer from '../plugin';
export declare class AIEmployeesManager {
  protected plugin: PluginAIServer;
  conversationController: Map<string, AbortController>;
  constructor(plugin: PluginAIServer);
  onAbortConversation(sessionId: string): boolean;
  abortConversation(sessionId: string): void;
}
