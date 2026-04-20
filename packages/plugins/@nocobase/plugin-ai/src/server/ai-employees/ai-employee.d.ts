/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model, Transaction } from '@nocobase/database';
import { Context } from '@nocobase/actions';
import { LLMProvider } from '../llm-providers/provider';
import { AIChatContext, AIChatConversation, AIMessage, AIMessageInput, UserDecision } from '../types';
import { DocumentSegmentedWithScore } from '../features';
import { KnowledgeBaseGroup } from '../types';
import { ToolsEntry } from '@nocobase/ai';
import { AIToolMessage } from '../types/ai-message.type';
export interface ModelRef {
  llmService: string;
  model: string;
}
export declare class AIEmployee {
  employee: Model;
  aiChatConversation: AIChatConversation;
  skillSettings?: Record<string, any>;
  private plugin;
  private db;
  private sessionId;
  private ctx;
  private systemMessage;
  private webSearch?;
  private model?;
  private legacy?;
  private protocol;
  constructor(
    ctx: Context,
    employee: Model,
    sessionId: string,
    systemMessage?: string,
    skillSettings?: Record<string, any>,
    webSearch?: boolean,
    model?: ModelRef,
    legacy?: boolean,
  );
  private buildState;
  private initSession;
  private buildChatContext;
  stream({
    messageId,
    userMessages,
    userDecisions,
  }: {
    messageId?: string;
    userMessages?: AIMessageInput[];
    userDecisions?: UserDecision[];
  }): Promise<boolean>;
  invoke({
    messageId,
    userMessages,
    userDecisions,
  }: {
    messageId?: string;
    userMessages?: AIMessageInput[];
    userDecisions?: UserDecision[];
  }): Promise<any>;
  getLLMService(): Promise<{
    provider: LLMProvider;
    model: string;
    service: any;
  }>;
  createAgent({
    provider,
    systemPrompt,
    tools,
    middleware,
  }: {
    provider: LLMProvider;
    systemPrompt?: string;
    tools?: any[];
    middleware?: any[];
  }): Promise<
    import('langchain/dist/agents/ReactAgent.cjs').ReactAgent<
      import('langchain/dist/agents/types.cjs').AgentTypeConfig<
        import('langchain/dist/agents/responses.cjs').ResponseFormatUndefined,
        undefined,
        import('langchain/dist/agents/middleware/types.cjs').AnyAnnotationRoot,
        any[],
        readonly any[]
      >
    >
  >;
  private getAgentInput;
  agentStream(
    provider: LLMProvider,
    context: AIChatContext,
    config?: any,
    state?: any,
  ): Promise<import('@langchain/core/dist/utils/stream').IterableReadableStream<Uint8Array>>;
  agentInvoke(provider: LLMProvider, context: AIChatContext, config?: any, state?: any): Promise<any>;
  prepareChatStream({
    chatContext,
    provider,
    config,
    state,
  }: {
    chatContext: AIChatContext;
    provider: LLMProvider;
    config?: {
      configurable?: any;
    };
    state?: any;
  }): Promise<{
    stream: import('@langchain/core/dist/utils/stream').IterableReadableStream<Uint8Array>;
    controller: AbortController;
    signal: AbortSignal;
  }>;
  processChatStream(
    stream: any,
    options: {
      signal: AbortSignal;
      providerName: string;
      model: string;
      provider: LLMProvider;
      allowEmpty?: boolean;
      responseMetadata: Map<string, any>;
    },
  ): Promise<void>;
  getEmployeeDataSourceContext(): string;
  getSystemPrompt(): Promise<string>;
  retrieveKnowledgeBase(userMessage: AIMessage): Promise<DocumentSegmentedWithScore[]>;
  isEnabledKnowledgeBase(): boolean;
  getAIEmployeeKnowledgeBaseConfig(): {
    topK: number;
    score: string;
  };
  getKnowledgeBaseGroup(): Promise<KnowledgeBaseGroup[]>;
  initToolCall(
    transaction: Transaction,
    messageId: string,
    toolCalls: {
      id: string;
      name: string;
      args: any;
    }[],
  ): Promise<Model<AIToolMessage>[]>;
  updateToolCallInterrupted(
    messageId: string,
    toolCallId: string,
    interruptAction: {
      order: number;
      description?: string;
      allowed_decisions?: string[];
    },
  ): Promise<number>;
  updateToolCallPending(messageId: string, toolCallId: string): Promise<number>;
  updateToolCallDone(messageId: string, toolCallId: string, result: any): Promise<number>;
  confirmToolCall(transaction: Transaction, messageId: string, toolCallIds: string[]): Promise<number>;
  getToolCallResult(messageId: string, toolCallId: string): Promise<AIToolMessage>;
  getToolCallResultMap(messageId: string, toolCallIds: string[]): Promise<Map<string, AIToolMessage>>;
  getUserDecisions(messageId: string): Promise<UserDecision[]>;
  cancelToolCall(): Promise<any>;
  get logger(): any;
  sendErrorResponse(errorMessage: string): void;
  sendSpecificError({ name, message }: { name: string; message: string }): void;
  updateThread(
    transaction: Transaction,
    {
      sessionId,
      thread,
    }: {
      sessionId: string;
      thread: number;
    },
  ): Promise<void>;
  removeAbortController(): void;
  shouldInterruptToolCall(tools: ToolsEntry): boolean;
  isAutoCall(tools: ToolsEntry): boolean;
  private formatMessages;
  private getToolCallMap;
  private toInterruptActions;
  private getAIEmployeeTools;
  private getMiddleware;
  private getCurrentThread;
  private forkCurrentThread;
  getToolsMap(): Promise<Map<string, import('@nocobase/ai').ToolsOptions>>;
  private listTools;
  private get toolsManager();
  private get aiConversationsRepo();
  private get aiMessagesRepo();
  private get aiMessagesModel();
  private get aiToolMessagesRepo();
  private get aiToolMessagesModel();
}
