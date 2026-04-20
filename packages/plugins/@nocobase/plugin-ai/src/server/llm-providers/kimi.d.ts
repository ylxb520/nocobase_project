/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ChatOpenAI } from '@langchain/openai';
import { LLMProvider } from './provider';
import { LLMProviderMeta } from '../manager/ai-manager';
export declare class KimiProvider extends LLMProvider {
  chatModel: ChatOpenAI;
  get baseURL(): string;
  createModel(): ChatOpenAI<import('@langchain/openai/dist/chat_models/index.cjs').ChatOpenAICallOptions>;
}
export declare const kimiProviderOptions: LLMProviderMeta;
