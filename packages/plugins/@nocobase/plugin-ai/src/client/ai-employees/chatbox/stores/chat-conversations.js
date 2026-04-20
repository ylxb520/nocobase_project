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
const store = create((set) => ({
  currentConversation: undefined,
  conversations: [],
  keyword: '',
  webSearch: false,
  setCurrentConversation: (id) => set({ currentConversation: id }),
  setKeyword: (keyword) => set({ keyword }),
  setConversations: (conversations) =>
    set((state) => ({
      conversations: typeof conversations === 'function' ? conversations(state.conversations) : conversations,
    })),
  setWebSearch: (webSearch) => set({ webSearch }),
}));
export const useChatConversationsStore = createSelectors(store);
//# sourceMappingURL=chat-conversations.js.map
