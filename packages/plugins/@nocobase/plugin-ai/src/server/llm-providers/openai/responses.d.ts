/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChatOpenAI } from '@langchain/openai';
import { LLMProvider } from '../provider';
import { Model } from '@nocobase/database';
import { AIMessageChunk } from '@langchain/core/messages';
export declare class OpenAIResponsesProvider extends LLMProvider {
  chatModel: ChatOpenAI;
  get baseURL(): string;
  createModel(): ChatOpenAI<import('@langchain/openai/dist/chat_models/index.cjs').ChatOpenAICallOptions>;
  parseResponseChunk(chunk: any): string;
  parseResponseMessage(message: Model): {
    key: any;
    content: any;
    role: any;
  };
  protected builtInTools(): any[];
  isToolConflict(): boolean;
  parseWebSearchAction(chunk: AIMessageChunk): {
    type: string;
    query: string;
  }[];
}
