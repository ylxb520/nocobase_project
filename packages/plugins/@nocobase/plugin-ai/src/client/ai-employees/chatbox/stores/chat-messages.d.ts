/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Message, Attachment, ContextItem, SkillSettings, WebSearching } from '../../types';
import { EditorRef } from '@nocobase/client';
type ChatMessagesState = {
  messages: Message[];
  attachments: Attachment[];
  contextItems: ContextItem[];
  systemMessage: string;
  responseLoading: boolean;
  abortController?: AbortController;
  skillSettings?: SkillSettings;
  editorRef?: Record<string, EditorRef>;
  currentEditorRefUid?: string;
  webSearching?: WebSearching;
  flowContext?: any;
};
export interface ChatMessagesActions {
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setAttachments: (attachments: Attachment[] | ((prev: Attachment[]) => Attachment[])) => void;
  setContextItems: (items: ContextItem[] | ((prev: ContextItem[]) => ContextItem[])) => void;
  setSystemMessage: (msg: string | ((prev: string) => string)) => void;
  setResponseLoading: (loading: boolean) => void;
  addMessage: (msg: Message) => void;
  addMessages: (msgs: Message[]) => void;
  updateLastMessage: (updater: (msg: Message) => Message) => void;
  removeMessage: (key: string) => void;
  addAttachments: (attachments: Attachment | Attachment[]) => void;
  removeAttachment: (filename: string) => void;
  addContextItems: (items: ContextItem | ContextItem[]) => void;
  removeContextItem: (type: string, uid: string) => void;
  setAbortController: (controller: AbortController | undefined) => void;
  setSkillSettings: (settings: SkillSettings | undefined) => void;
  setEditorRef: (uid: string, editorRef: EditorRef) => void;
  setCurrentEditorRefUid: (uid: string) => void;
  setWebSearching: (webSearching: WebSearching) => void;
  setFlowContext: (ctx: any) => void;
}
export declare const useChatMessagesStore: {
  (): ChatMessagesState & ChatMessagesActions;
  <U>(selector: (state: ChatMessagesState & ChatMessagesActions) => U): U;
} & import('zustand').StoreApi<ChatMessagesState & ChatMessagesActions> & {
    use: {
      messages: () => Message[];
      attachments: () => any[];
      contextItems: () => ContextItem[];
      systemMessage: () => string;
      responseLoading: () => boolean;
      abortController?: () => AbortController;
      skillSettings?: () => SkillSettings;
      editorRef?: () => Record<string, EditorRef>;
      currentEditorRefUid?: () => string;
      webSearching?: () => WebSearching;
      flowContext?: () => any;
      setMessages: () => (messages: Message[] | ((prev: Message[]) => Message[])) => void;
      setAttachments: () => (attachments: any[] | ((prev: Attachment[]) => Attachment[])) => void;
      setContextItems: () => (items: ContextItem[] | ((prev: ContextItem[]) => ContextItem[])) => void;
      setSystemMessage: () => (msg: string | ((prev: string) => string)) => void;
      setResponseLoading: () => (loading: boolean) => void;
      addMessage: () => (msg: Message) => void;
      addMessages: () => (msgs: Message[]) => void;
      updateLastMessage: () => (updater: (msg: Message) => Message) => void;
      removeMessage: () => (key: string) => void;
      addAttachments: () => (attachments: Attachment | Attachment[]) => void;
      removeAttachment: () => (filename: string) => void;
      addContextItems: () => (items: ContextItem | ContextItem[]) => void;
      removeContextItem: () => (type: string, uid: string) => void;
      setAbortController: () => (controller: AbortController | undefined) => void;
      setSkillSettings: () => (settings: SkillSettings | undefined) => void;
      setEditorRef: () => (uid: string, editorRef: EditorRef) => void;
      setCurrentEditorRefUid: () => (uid: string) => void;
      setWebSearching: () => (webSearching: WebSearching) => void;
      setFlowContext: () => (ctx: any) => void;
    };
  };
export {};
