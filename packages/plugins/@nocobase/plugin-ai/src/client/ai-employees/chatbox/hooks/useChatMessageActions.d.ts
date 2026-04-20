/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AIEmployee, Message, ResendOptions, SendOptions } from '../../types';
export declare const useChatMessageActions: () => {
  messagesService: import('@nocobase/client').UseRequestResult<{
    data: Message[];
    meta: {
      cursor?: string;
      hasMore?: boolean;
    };
  }>;
  sendMessages: ({
    sessionId,
    aiEmployee,
    systemMessage,
    messages: sendMsgs,
    attachments,
    workContext,
    editingMessageId,
    onConversationCreate,
    skillSettings,
    webSearch,
    model: inputModel,
  }: SendOptions & {
    onConversationCreate?: (sessionId: string) => void;
  }) => Promise<void>;
  resendMessages: ({ sessionId, messageId, aiEmployee, important }: ResendOptions) => Promise<void>;
  cancelRequest: () => Promise<void>;
  resumeToolCall: ({
    sessionId,
    messageId,
    aiEmployee,
    toolCallIds,
    toolCallResults,
  }: {
    sessionId: string;
    messageId: string;
    aiEmployee: AIEmployee;
    toolCallIds?: string[];
    toolCallResults?: {
      [key: string]: any;
      id: string;
    }[];
  }) => Promise<void>;
  updateToolArgs: ({ sessionId, messageId, tool }: { sessionId: any; messageId: any; tool: any }) => Promise<void>;
  lastMessageRef: (node: HTMLElement) => void;
  startEditingMessage: (msg: any) => void;
  finishEditingMessage: () => void;
};
