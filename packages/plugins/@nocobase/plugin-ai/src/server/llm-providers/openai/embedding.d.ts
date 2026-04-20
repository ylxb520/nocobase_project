/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { EmbeddingProvider } from '../provider';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
export declare class OpenAiEmbeddingProvider extends EmbeddingProvider {
  protected getDefaultUrl(): string;
  createEmbedding(): EmbeddingsInterface;
}
