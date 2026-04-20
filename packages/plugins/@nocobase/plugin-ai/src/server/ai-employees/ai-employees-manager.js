/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class AIEmployeesManager {
  plugin;
  conversationController = new Map();
  constructor(plugin) {
    this.plugin = plugin;
  }
  onAbortConversation(sessionId) {
    const controller = this.conversationController.get(sessionId);
    if (controller) {
      controller.abort();
      this.conversationController.delete(sessionId);
      return true;
    }
    return false;
  }
  abortConversation(sessionId) {
    const aborted = this.onAbortConversation(sessionId);
    if (!aborted) {
      this.plugin.sendSyncMessage({
        type: 'aiEmployees:abortConversation',
        payload: {
          sessionId,
        },
      });
    }
  }
}
//# sourceMappingURL=ai-employees-manager.js.map
