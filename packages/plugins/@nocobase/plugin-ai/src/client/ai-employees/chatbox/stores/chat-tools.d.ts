/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Message, ToolCall } from '../../types';
interface ChatToolsState {
  toolsByName: Record<
    string,
    (ToolCall<unknown> & {
      messageId?: string;
    })[]
  >;
  toolsByMessageId: Record<
    string,
    Record<
      string,
      ToolCall<unknown> & {
        version: number;
      }
    >
  >;
  openToolModal?: boolean;
  activeTool?: ToolCall<unknown>;
  activeMessageId?: string;
  adjustArgs?: Record<string, any>;
}
interface ChatToolsActions {
  updateTools: (messages: Message[]) => void;
  setOpenToolModal: (open: boolean) => void;
  setActiveTool: (tool: ToolCall<unknown>) => void;
  setActiveMessageId: (messageId: string) => void;
  setAdjustArgs: (args: Record<string, any>) => void;
}
export declare const useChatToolsStore: {
  (): ChatToolsState & ChatToolsActions;
  <U>(selector: (state: ChatToolsState & ChatToolsActions) => U): U;
} & import('zustand').StoreApi<ChatToolsState & ChatToolsActions> & {
    use: {
      toolsByName: () => Record<
        string,
        (ToolCall<unknown> & {
          messageId?: string;
        })[]
      >;
      toolsByMessageId: () => Record<
        string,
        Record<
          string,
          ToolCall<unknown> & {
            version: number;
          }
        >
      >;
      openToolModal?: () => boolean;
      activeTool?: () => ToolCall<unknown>;
      activeMessageId?: () => string;
      adjustArgs?: () => Record<string, any>;
      updateTools: () => (messages: Message[]) => void;
      setOpenToolModal: () => (open: boolean) => void;
      setActiveTool: () => (tool: ToolCall<unknown>) => void;
      setActiveMessageId: () => (messageId: string) => void;
      setAdjustArgs: () => (args: Record<string, any>) => void;
    };
  };
export {};
