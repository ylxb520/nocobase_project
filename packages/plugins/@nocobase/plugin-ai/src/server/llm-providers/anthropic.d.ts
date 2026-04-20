/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { LLMProvider } from './provider';
import { ChatAnthropic } from '@langchain/anthropic';
import { Model } from '@nocobase/database';
import { LLMProviderMeta } from '../manager/ai-manager';
import { Context } from '@nocobase/actions';
import { AIMessageChunk } from '@langchain/core/messages';
export declare class AnthropicProvider extends LLMProvider {
  chatModel: ChatAnthropic;
  get baseURL(): string;
  createModel(): ChatAnthropic;
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
  protected builtInTools(): any[];
  isToolConflict(): boolean;
  parseWebSearchAction(chunk: AIMessageChunk): {
    type: string;
    query: string;
  }[];
  parseAttachment(ctx: Context, attachment: any): Promise<any>;
}
export declare const anthropicProviderOptions: LLMProviderMeta;
