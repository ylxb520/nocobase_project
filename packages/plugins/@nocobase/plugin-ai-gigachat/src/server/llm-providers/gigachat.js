/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Agent } from 'node:https';
import GigaChat from 'gigachat';
import { GigaChat as GigaChatModel } from 'langchain-gigachat';
import { LLMProvider } from '@nocobase/plugin-ai';
class GigaChatModelInternal extends GigaChatModel {
  bindTools(tools, kwargs) {
    return this.withConfig({
      tools: tools?.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.schema.toJSONSchema?.() ?? t.schema,
      })),
      ...kwargs,
    });
  }
}
export class GigaChatProvider extends LLMProvider {
  createModel() {
    const { apiKey: credentials, baseURL, authURL, scope, enableSSL } = this.serviceOptions || {};
    const { responseFormat } = this.modelOptions || {};
    const baseUrl = this.isUrlEmpty(baseURL) ? this.baseURL : baseURL;
    const authUrl = this.isUrlEmpty(authURL) ? this.authURL : authURL;
    const httpsAgent = new Agent({
      rejectUnauthorized: enableSSL ?? false,
    });
    return new GigaChatModelInternal({
      credentials,
      baseUrl,
      authUrl,
      scope,
      ...this.modelOptions,
      invocationKwargs: {
        response_format: {
          type: responseFormat,
        },
      },
      httpsAgent,
    });
  }
  async listModels() {
    try {
      const { apiKey: credentials, baseURL, authURL, scope, enableSSL } = this.serviceOptions || {};
      const baseUrl = this.isUrlEmpty(baseURL) ? this.baseURL : baseURL;
      const authUrl = this.isUrlEmpty(authURL) ? this.authURL : authURL;
      const httpsAgent = new Agent({
        rejectUnauthorized: enableSSL ?? false,
      });
      const giga = new GigaChat({
        credentials,
        baseUrl,
        authUrl,
        scope,
        httpsAgent,
      });
      const models = await giga.getModels();
      return { models: models.data };
    } catch (e) {
      return { code: 500, errMsg: e.message };
    }
  }
  get baseURL() {
    return 'https://gigachat.devices.sberbank.ru/api/v1';
  }
  get authURL() {
    return 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
  }
  isUrlEmpty(baseURL) {
    return !baseURL || baseURL === null || baseURL.trim().length === 0;
  }
  parseResponseError(err) {
    if (err?.name === 'AuthenticationError' || err?.name === 'ResponseError') {
      return `GigaChat service error: ${err.response?.status} ${err.response?.statusText}`;
    }
    return err?.message ?? 'Unexpected LLM service error';
  }
}
export const gigaChatProviderOptions = {
  title: 'GigaChat',
  provider: GigaChatProvider,
};
//# sourceMappingURL=gigachat.js.map
