/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { create } from 'zustand';
import { createSelectors } from './create-selectors';
const store = create((set, get) => ({
  toolCalls: {},
  updateToolCallInvokeStatus: (messageId, toolCallId, invokeStatus) => {
    set((state) => {
      const list = state.toolCalls[messageId] ?? [];
      const exists = list.some((tc) => tc.id === toolCallId);
      const nextList = exists
        ? list.map((tc) => (tc.id === toolCallId ? { ...tc, invokeStatus } : tc))
        : [...list, { id: toolCallId, invokeStatus }];
      const result = {
        toolCalls: {
          ...state.toolCalls,
          [messageId]: nextList,
        },
      };
      return result;
    });
  },
  isAllWaiting: (messageId) => {
    const list = get().toolCalls[messageId];
    if (!list || list.length === 0) return false;
    return list.every((x) => x.invokeStatus === 'waiting');
  },
  isInterrupted: (messageId, toolCallId) => {
    const list = get().toolCalls[messageId] ?? [];
    const toolCall = list.find((x) => x.id === toolCallId);
    return toolCall?.invokeStatus === 'interrupted';
  },
  getInvokeStatus: (messageId, toolCallId) => {
    const list = get().toolCalls[messageId] ?? [];
    const toolCall = list.find((x) => x.id === toolCallId);
    return toolCall?.invokeStatus;
  },
}));
export const useChatToolCallStore = createSelectors(store);
//# sourceMappingURL=chat-tool-call.js.map
