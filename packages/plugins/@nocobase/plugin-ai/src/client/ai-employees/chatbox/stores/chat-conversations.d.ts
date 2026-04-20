/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Conversation } from '../../types';
interface ChatConversationsState {
  currentConversation?: string;
  conversations: Conversation[];
  keyword: string;
  webSearch: boolean;
}
interface ChatConversationsActions {
  setCurrentConversation: (id: string | undefined) => void;
  setKeyword: (keyword: string) => void;
  setConversations: (conversations: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void;
  setWebSearch: (webSearch: boolean) => void;
}
export declare const useChatConversationsStore: {
  (): ChatConversationsState & ChatConversationsActions;
  <U>(selector: (state: ChatConversationsState & ChatConversationsActions) => U): U;
} & import('zustand').StoreApi<ChatConversationsState & ChatConversationsActions> & {
    use: {
      currentConversation?: () => string;
      conversations: () => Conversation[];
      keyword: () => string;
      webSearch: () => boolean;
      setCurrentConversation: () => (id: string | undefined) => void;
      setKeyword: () => (keyword: string) => void;
      setConversations: () => (conversations: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void;
      setWebSearch: () => (webSearch: boolean) => void;
    };
  };
export {};
