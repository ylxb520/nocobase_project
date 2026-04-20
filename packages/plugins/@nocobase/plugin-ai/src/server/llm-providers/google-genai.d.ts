/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { EmbeddingProvider, LLMProvider } from './provider';
import { Model } from '@nocobase/database';
import { LLMProviderMeta } from '../manager/ai-manager';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { Context } from '@nocobase/actions';
import { AIChatContext } from '../types/ai-chat-conversation.type';
import { LLMResult } from '@langchain/core/outputs';
export declare class GoogleGenAIProvider extends LLMProvider {
  chatModel: ChatGoogleGenerativeAI;
  get baseURL(): string;
  createModel(): ChatGoogleGenerativeAI;
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
  parseAttachment(
    ctx: Context,
    attachment: any,
  ): Promise<
    | {
        type: string;
        image_url: {
          url: string;
        };
        data?: undefined;
      }
    | {
        type: any;
        data: string;
        image_url?: undefined;
      }
  >;
  parseResponseMetadata(output: LLMResult): any[];
  getStructuredOutputOptions(structuredOutput: AIChatContext['structuredOutput']): {
    schema: any;
    options: Record<string, any>;
  };
  protected builtInTools(): any[];
  isToolConflict(): boolean;
}
export declare class GoogleGenAIEmbeddingProvider extends EmbeddingProvider {
  protected getDefaultUrl(): string;
  createEmbedding(): EmbeddingsInterface;
}
export declare const googleGenAIProviderOptions: LLMProviderMeta;
