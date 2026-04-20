/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
import { Bubble, Sender } from '@ant-design/x';
import { GetProp, GetRef } from 'antd';
import { AIEmployee } from '../../types';
type RolesType = GetProp<typeof Bubble.List, 'roles'>;
export interface ModelRef {
  llmService: string;
  model: string;
}
interface ChatBoxState {
  open: boolean;
  expanded: boolean;
  collapsed: boolean;
  showConversations: boolean;
  minimize: boolean;
  currentEmployee?: AIEmployee;
  senderValue: string;
  senderPlaceholder: string;
  roles: GetProp<typeof Bubble.List, 'roles'>;
  taskVariables: {
    variables?: Record<string, any>;
    localVariables?: Record<string, any>;
  };
  isEditingMessage: boolean;
  editingMessageId?: string;
  chatBoxRef: React.MutableRefObject<HTMLDivElement> | null;
  senderRef: React.MutableRefObject<GetRef<typeof Sender>> | null;
  showCodeHistory: boolean;
  model?: ModelRef | null;
  showDebugPanel: boolean;
}
interface ChatBoxActions {
  setOpen: (open: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
  setShowConversations: (show: boolean) => void;
  setMinimize: (minus: boolean) => void;
  setCurrentEmployee: (aiEmployee?: AIEmployee | ((prev: AIEmployee) => AIEmployee)) => void;
  setSenderValue: (value: string) => void;
  setSenderPlaceholder: (placeholder: string) => void;
  setTaskVariables: (variables: ChatBoxState['taskVariables']) => void;
  setRoles: (roles: RolesType | ((prev: RolesType) => RolesType)) => void;
  addRole: (name: string, role: any) => void;
  setIsEditingMessage: (isEditing: boolean) => void;
  setEditingMessageId: (id?: string) => void;
  setChatBoxRef: (ref: React.MutableRefObject<HTMLDivElement> | null) => void;
  setSenderRef: (ref: React.MutableRefObject<GetRef<typeof Sender>> | null) => void;
  setShowCodeHistory: (show: boolean) => void;
  setModel: (model: ModelRef | null) => void;
  setShowDebugPanel: (show: boolean) => void;
}
export declare const useChatBoxStore: {
  (): ChatBoxState & ChatBoxActions;
  <U>(selector: (state: ChatBoxState & ChatBoxActions) => U): U;
} & import('zustand').StoreApi<ChatBoxState & ChatBoxActions> & {
    use: {
      open: () => boolean;
      expanded: () => boolean;
      collapsed: () => boolean;
      showConversations: () => boolean;
      minimize: () => boolean;
      currentEmployee?: () => AIEmployee;
      senderValue: () => string;
      senderPlaceholder: () => string;
      roles: () => GetProp<
        import('react').ForwardRefExoticComponent<
          import('@ant-design/x/es/bubble/BubbleList').BubbleListProps &
            import('react').RefAttributes<import('@ant-design/x/es/bubble/BubbleList').BubbleListRef>
        >,
        'roles'
      >;
      taskVariables: () => {
        variables?: Record<string, any>;
        localVariables?: Record<string, any>;
      };
      isEditingMessage: () => boolean;
      editingMessageId?: () => string;
      chatBoxRef: () => import('react').MutableRefObject<HTMLDivElement>;
      senderRef: () => import('react').MutableRefObject<import('@ant-design/x/es/sender').SenderRef>;
      showCodeHistory: () => boolean;
      model?: () => ModelRef;
      showDebugPanel: () => boolean;
      setOpen: () => (open: boolean) => void;
      setExpanded: () => (expanded: boolean) => void;
      setCollapsed: () => (collapsed: boolean) => void;
      setShowConversations: () => (show: boolean) => void;
      setMinimize: () => (minus: boolean) => void;
      setCurrentEmployee: () => (aiEmployee?: AIEmployee | ((prev: AIEmployee) => AIEmployee)) => void;
      setSenderValue: () => (value: string) => void;
      setSenderPlaceholder: () => (placeholder: string) => void;
      setTaskVariables: () => (variables: ChatBoxState['taskVariables']) => void;
      setRoles: () => (roles: RolesType | ((prev: RolesType) => RolesType)) => void;
      addRole: () => (name: string, role: any) => void;
      setIsEditingMessage: () => (isEditing: boolean) => void;
      setEditingMessageId: () => (id?: string) => void;
      setChatBoxRef: () => (ref: React.MutableRefObject<HTMLDivElement> | null) => void;
      setSenderRef: () => (ref: React.MutableRefObject<GetRef<typeof Sender>> | null) => void;
      setShowCodeHistory: () => (show: boolean) => void;
      setModel: () => (model: ModelRef | null) => void;
      setShowDebugPanel: () => (show: boolean) => void;
    };
  };
export {};
