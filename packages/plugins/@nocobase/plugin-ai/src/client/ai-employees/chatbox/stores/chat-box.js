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
const store = create()((set) => ({
  open: false,
  expanded: false,
  collapsed: false,
  showConversations: false,
  minimize: false,
  currentEmployee: null,
  senderValue: '',
  senderPlaceholder: '',
  taskVariables: {},
  roles: {},
  isEditingMessage: false,
  editingMessageId: null,
  chatBoxRef: {
    current: null,
  },
  senderRef: {
    current: null,
  },
  showCodeHistory: false,
  model: null,
  // [AI_DEBUG]
  showDebugPanel: false,
  setOpen: (open) => set({ open, ...(open ? {} : { collapsed: false }) }),
  setExpanded: (expanded) => set({ expanded, ...(expanded ? { collapsed: false } : {}) }),
  setCollapsed: (collapsed) => set({ collapsed }),
  setShowConversations: (show) => set({ showConversations: show }),
  setMinimize: (minus) => set({ minimize: minus }),
  setCurrentEmployee: (employee) =>
    set((state) => ({
      currentEmployee: typeof employee === 'function' ? employee(state.currentEmployee) : employee,
    })),
  setSenderValue: (val) => set({ senderValue: val }),
  setSenderPlaceholder: (val) => set({ senderPlaceholder: val }),
  setTaskVariables: (vars) => set({ taskVariables: vars }),
  setRoles: (roles) =>
    set((state) => ({
      roles: typeof roles === 'function' ? roles(state.roles) : roles,
    })),
  addRole: (name, role) => set((state) => ({ roles: { ...state.roles, [name]: role } })),
  setIsEditingMessage: (isEditing) => set({ isEditingMessage: isEditing }),
  setEditingMessageId: (id) => set({ editingMessageId: id }),
  setChatBoxRef: (ref) => set({ chatBoxRef: ref }),
  setSenderRef: (ref) => set({ senderRef: ref }),
  setShowCodeHistory: (show) => set({ showCodeHistory: show }),
  setModel: (model) => set({ model }),
  // [AI_DEBUG]
  setShowDebugPanel: (show) => set({ showDebugPanel: show }),
}));
export const useChatBoxStore = createSelectors(store);
//# sourceMappingURL=chat-box.js.map
