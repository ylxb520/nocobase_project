/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChatOllama } from '@langchain/ollama';
import { LLMProvider, EmbeddingProvider } from './provider';
import { LLMProviderMeta } from '../manager/ai-manager';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
export declare class OllamaProvider extends LLMProvider {
  chatModel: ChatOllama;
  get baseURL(): string;
  createModel(): ChatOllama;
  listModels(): Promise<{
    models?: {
      id: string;
    }[];
    code?: number;
    errMsg?: string;
  }>;
}
export declare class OllamaEmbeddingProvider extends EmbeddingProvider {
  protected getDefaultUrl(): string;
  createEmbedding(): EmbeddingsInterface;
}
export declare const ollamaProviderOptions: LLMProviderMeta;
