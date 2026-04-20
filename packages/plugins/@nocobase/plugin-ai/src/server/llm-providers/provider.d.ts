/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Model } from '@nocobase/database';
import { Application } from '@nocobase/server';
import { AIChatContext } from '../types/ai-chat-conversation.type';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { AIMessageChunk } from '@langchain/core/messages';
import { Context } from '@nocobase/actions';
import '@langchain/core/utils/stream';
import { LLMResult } from '@langchain/core/outputs';
export interface LLMProviderOptions {
  app: Application;
  serviceOptions?: Record<string, any>;
  modelOptions?: Record<string, any>;
}
export declare abstract class LLMProvider {
  app: Application;
  serviceOptions: Record<string, any>;
  modelOptions: Record<string, any>;
  chatModel: any;
  abstract createModel(): BaseChatModel | any;
  get baseURL(): any;
  constructor(opts: LLMProviderOptions);
  prepareChain(context: AIChatContext): any;
  invoke(context: AIChatContext, options?: any): Promise<any>;
  stream(context: AIChatContext, options?: any): Promise<any>;
  listModels(): Promise<{
    models?: {
      id: string;
    }[];
    code?: number;
    errMsg?: string;
  }>;
  parseResponseMessage(message: Model): {
    key: any;
    content: any;
    role: any;
  };
  parseResponseChunk(chunk: any): string;
  parseAttachment(ctx: Context, attachment: any): Promise<any>;
  getStructuredOutputOptions(structuredOutput: AIChatContext['structuredOutput']): any;
  testFlight(): Promise<{
    status: 'success' | 'error';
    code: number;
    message?: string;
  }>;
  protected builtInTools(): any[];
  isToolConflict(): boolean;
  resolveTools(toolDefinitions: any[]): any[];
  parseWebSearchAction(chunk: AIMessageChunk): {
    type: string;
    query: string;
  }[];
  parseResponseMetadata(output: LLMResult): any;
  parseResponseError(err: any): any;
}
export interface EmbeddingProviderOptions {
  app: Application;
  serviceOptions?: Record<string, any>;
  modelOptions?: Record<string, any>;
}
export declare abstract class EmbeddingProvider {
  protected opts: EmbeddingProviderOptions;
  protected app: Application;
  protected serviceOptions?: Record<string, any>;
  protected modelOptions?: Record<string, any>;
  constructor(opts: EmbeddingProviderOptions);
  abstract createEmbedding(): EmbeddingsInterface;
  protected abstract getDefaultUrl(): string;
  protected get apiKey(): any;
  protected get baseUrl(): any;
  protected get model(): any;
}
type FromType = 'ToolsEntry';
export declare class ToolDefinition<T> {
  private from;
  private _tool;
  constructor(from: FromType, _tool: T);
  static from(from: FromType): (tool: any) => import('@langchain/core/dist/tools').DynamicTool<any>;
  get tool(): import('@langchain/core/dist/tools').DynamicTool<any>;
  private convertToolOptions;
}
export {};
