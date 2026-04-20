/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChatOpenAI } from '@langchain/openai';
import { EmbeddingProvider, LLMProvider } from './provider';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { SupportedModel } from '../manager/ai-manager';
export declare class DashscopeProvider extends LLMProvider {
  chatModel: ChatOpenAI;
  get baseURL(): string;
  createModel(): ChatOpenAI<import('@langchain/openai/dist/chat_models/index.cjs').ChatOpenAICallOptions>;
}
export declare class DashscopeEmbeddingProvider extends EmbeddingProvider {
  protected getDefaultUrl(): string;
  createEmbedding(): EmbeddingsInterface;
}
export declare const dashscopeProviderOptions: {
  title: string;
  supportedModel: SupportedModel[];
  supportWebSearch: boolean;
  models: {
    LLM: string[];
    EMBEDDING: string[];
  };
  provider: typeof DashscopeProvider;
  embedding: typeof DashscopeEmbeddingProvider;
};
