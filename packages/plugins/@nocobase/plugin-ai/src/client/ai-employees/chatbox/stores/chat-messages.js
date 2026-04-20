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
  messages: [],
  attachments: [],
  contextItems: [],
  systemMessage: '',
  responseLoading: false,
  abortController: null,
  skillSettings: null,
  editorRef: {},
  currentEditorRefUid: null,
  webSearching: null,
  flowContext: null,
  setMessages: (messages) => {
    set((state) => {
      return {
        messages: typeof messages === 'function' ? messages(state.messages) : messages,
      };
    });
  },
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  addMessages: (msgs) =>
    set((state) => ({
      messages: [...state.messages, ...msgs],
    })),
  updateLastMessage: (fn) =>
    set((state) => {
      const prev = [...state.messages];
      const i = prev.length - 1;
      if (i >= 0) prev[i] = fn(prev[i]);
      return { messages: prev };
    }),
  removeMessage: (key) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.key !== key),
    })),
  setResponseLoading: (v) =>
    set(() => ({
      responseLoading: v,
    })),
  setSystemMessage: (s) =>
    set((state) => ({
      systemMessage: typeof s === 'function' ? s(state.systemMessage) : s,
    })),
  setAttachments: (a) =>
    set((state) => ({
      attachments: typeof a === 'function' ? a(state.attachments) : a,
    })),
  addAttachments: (a) =>
    set((state) => ({
      attachments: Array.isArray(a) ? [...state.attachments, ...a] : [...state.attachments, a],
    })),
  removeAttachment: (filename) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a.filename !== filename),
    })),
  setContextItems: (i) =>
    set((state) => ({
      contextItems: typeof i === 'function' ? i(state.contextItems) : i,
    })),
  addContextItems: (items) => {
    const next = Array.isArray(items) ? items : [items];
    set((state) => {
      const map = new Map();
      for (const item of state.contextItems) {
        map.set(`${item.type}:${item.uid}`, item);
      }
      for (const item of next) {
        map.set(`${item.type}:${item.uid}`, item);
      }
      return {
        contextItems: Array.from(map.values()),
      };
    });
  },
  removeContextItem: (type, uid) =>
    set((state) => ({
      contextItems: state.contextItems.filter((item) => !(item.type === type && item.uid === uid)),
    })),
  setAbortController: (controller) => set({ abortController: controller }),
  setSkillSettings: (settings) => set({ skillSettings: settings }),
  setEditorRef: (uid, editorRef) => set((state) => ({ editorRef: { ...state.editorRef, [uid]: editorRef } })),
  setCurrentEditorRefUid: (uid) => set({ currentEditorRefUid: uid }),
  setWebSearching(webSearching) {
    set({ webSearching });
  },
  setFlowContext(flowContext) {
    set({ flowContext });
  },
}));
export const useChatMessagesStore = createSelectors(store);
//# sourceMappingURL=chat-messages.js.map
