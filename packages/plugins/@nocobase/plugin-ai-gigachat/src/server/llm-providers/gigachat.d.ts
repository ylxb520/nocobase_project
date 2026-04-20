/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { GigaChat as GigaChatModel } from 'langchain-gigachat';
import { LLMProvider, LLMProviderMeta } from '@nocobase/plugin-ai';
declare class GigaChatModelInternal extends GigaChatModel {
  bindTools(
    tools: any,
    kwargs: any,
  ): import('@langchain/core/dist/runnables/base').Runnable<
    import('@langchain/core/dist/language_models/base').BaseLanguageModelInput,
    import('@langchain/core/dist/messages/ai').AIMessageChunk<
      import('@langchain/core/dist/messages/message').MessageStructure<
        import('@langchain/core/dist/messages/message').MessageToolSet
      >
    >,
    import('langchain-gigachat').GigaChatCallOptions
  >;
}
export declare class GigaChatProvider extends LLMProvider {
  createModel(): GigaChatModelInternal;
  listModels(): Promise<{
    models?: {
      id: string;
    }[];
    code?: number;
    errMsg?: string;
  }>;
  get baseURL(): string;
  get authURL(): string;
  private isUrlEmpty;
  parseResponseError(err: any): any;
}
export declare const gigaChatProviderOptions: LLMProviderMeta;
export {};
