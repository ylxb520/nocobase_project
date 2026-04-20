/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
type ChatToolCallState = {
  toolCalls: Record<
    string,
    {
      id: string;
      invokeStatus: string;
    }[]
  >;
};
export interface ChatToolCallActions {
  updateToolCallInvokeStatus: (messageId: string, toolCallId: string, invokeStatus: string) => void;
  isAllWaiting: (messageId: string) => boolean;
  isInterrupted: (messageId: string, toolCallId: string) => boolean;
  getInvokeStatus: (messageId: string, toolCallId: string) => string;
}
export declare const useChatToolCallStore: {
  (): ChatToolCallState & ChatToolCallActions;
  <U>(selector: (state: ChatToolCallState & ChatToolCallActions) => U): U;
} & import('zustand').StoreApi<ChatToolCallState & ChatToolCallActions> & {
    use: {
      toolCalls: () => Record<
        string,
        {
          id: string;
          invokeStatus: string;
        }[]
      >;
      updateToolCallInvokeStatus: () => (messageId: string, toolCallId: string, invokeStatus: string) => void;
      isAllWaiting: () => (messageId: string) => boolean;
      isInterrupted: () => (messageId: string, toolCallId: string) => boolean;
      getInvokeStatus: () => (messageId: string, toolCallId: string) => string;
    };
  };
export {};
