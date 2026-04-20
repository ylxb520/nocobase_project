/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import axios from 'axios';
import { encodeFile, parseResponseMessage, stripToolCallTags } from '../utils';
import { tool } from 'langchain';
import '@langchain/core/utils/stream';
export class LLMProvider {
  app;
  serviceOptions;
  modelOptions;
  chatModel;
  get baseURL() {
    return null;
  }
  constructor(opts) {
    const { app, serviceOptions, modelOptions } = opts;
    this.app = app;
    this.serviceOptions = app.environment.renderJsonTemplate(serviceOptions);
    if (modelOptions) {
      this.modelOptions = modelOptions;
      this.chatModel = this.createModel();
    }
  }
  prepareChain(context) {
    let chain = this.chatModel;
    const toolDefinitions = context.tools?.map(ToolDefinition.from('ToolsEntry'));
    if (this.builtInTools()?.length) {
      const tools = [...this.builtInTools()];
      if (!this.isToolConflict() && toolDefinitions?.length) {
        tools.push(...toolDefinitions);
      }
      chain = chain.bindTools?.(tools);
    } else if (toolDefinitions?.length) {
      chain = chain.bindTools?.(toolDefinitions);
    }
    if (context.structuredOutput) {
      const { schema, options } = this.getStructuredOutputOptions(context.structuredOutput) || {};
      if (schema) {
        chain = chain.withStructuredOutput(schema, options);
      }
    }
    return chain;
  }
  async invoke(context, options) {
    const chain = this.prepareChain(context);
    return chain.invoke(context.messages, options);
  }
  async stream(context, options) {
    const chain = this.prepareChain(context);
    return chain.streamEvents(context.messages, options);
  }
  async listModels() {
    const options = this.serviceOptions || {};
    const apiKey = options.apiKey;
    let baseURL = options.baseURL || this.baseURL;
    if (!baseURL) {
      return { code: 400, errMsg: 'baseURL is required' };
    }
    if (!apiKey) {
      return { code: 400, errMsg: 'API Key required' };
    }
    if (baseURL && baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1);
    }
    try {
      const res = await axios.get(`${baseURL}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return { models: res?.data.data };
    } catch (e) {
      const status = e.response?.status || 500;
      const data = e.response?.data;
      const errorMsg =
        data?.error?.message ||
        data?.message ||
        (typeof data?.error === 'string' ? data.error : undefined) ||
        (typeof data === 'string' ? data : undefined) ||
        e.response?.statusText ||
        e.message;
      return { code: status, errMsg: errorMsg };
    }
  }
  parseResponseMessage(message) {
    return parseResponseMessage(message);
  }
  parseResponseChunk(chunk) {
    return stripToolCallTags(chunk);
  }
  async parseAttachment(ctx, attachment) {
    const fileManager = this.app.pm.get('file-manager');
    const url = await fileManager.getFileURL(attachment);
    const data = await encodeFile(ctx, decodeURIComponent(url));
    if (attachment.mimetype.startsWith('image/')) {
      return {
        type: 'image_url',
        image_url: {
          url: `data:image/${attachment.mimetype.split('/')[1]};base64,${data}`,
        },
      };
    } else {
      return {
        type: 'file',
        mimeType: attachment.mimetype,
        metadata: {
          filename: attachment.filename,
        },
        data,
      };
    }
  }
  getStructuredOutputOptions(structuredOutput) {
    const { responseFormat } = this.modelOptions || {};
    const { schema, name, description, strict } = structuredOutput || {};
    if (!schema) {
      return;
    }
    const methods = {
      json_object: 'jsonMode',
      json_schema: 'jsonSchema',
    };
    const options = {
      includeRaw: true,
      name,
      method: methods[responseFormat],
    };
    if (strict) {
      options['strict'] = strict;
    }
    return {
      schema: {
        name,
        description,
        parameters: schema,
      },
      options,
    };
  }
  async testFlight() {
    try {
      const result = await this.chatModel.invoke('hello');
    } catch (error) {
      return {
        status: 'error',
        code: 1,
        message: error.message,
      };
    }
    return {
      status: 'success',
      code: 0,
    };
  }
  builtInTools() {
    return [];
  }
  isToolConflict() {
    return false;
  }
  resolveTools(toolDefinitions) {
    const builtIn = this.builtInTools();
    if (builtIn.length > 0 && toolDefinitions.length > 0 && this.isToolConflict()) {
      return [...builtIn];
    }
    return [...builtIn, ...toolDefinitions];
  }
  parseWebSearchAction(chunk) {
    return [];
  }
  parseResponseMetadata(output) {
    return [null, null];
  }
  parseResponseError(err) {
    return err?.message ?? 'Unexpected LLM service error';
  }
}
export class EmbeddingProvider {
  opts;
  app;
  serviceOptions;
  modelOptions;
  constructor(opts) {
    this.opts = opts;
    const { app, serviceOptions, modelOptions } = this.opts;
    this.app = app;
    this.serviceOptions = app.environment.renderJsonTemplate(serviceOptions ?? {});
    this.modelOptions = modelOptions;
  }
  get apiKey() {
    const { apiKey } = this.serviceOptions ?? {};
    if (!apiKey) {
      throw new Error('apiKey is required');
    }
    return apiKey;
  }
  get baseUrl() {
    const baseUrl = this.serviceOptions?.baseUrl ?? this.getDefaultUrl();
    if (!baseUrl) {
      throw new Error('baseUrl is required');
    }
    return baseUrl;
  }
  get model() {
    const { model } = this.modelOptions ?? {};
    if (!model) {
      throw new Error('Embedding model is required');
    }
    return model;
  }
}
export class ToolDefinition {
  from;
  _tool;
  constructor(from, _tool) {
    this.from = from;
    this._tool = _tool;
  }
  static from(from) {
    return (tool) => new ToolDefinition(from, tool).tool;
  }
  get tool() {
    if (this.from === 'ToolsEntry') {
      return this.convertToolOptions();
    } else {
      throw new Error('not supported tool definitions');
    }
  }
  convertToolOptions() {
    const {
      invoke,
      definition: { name, description, schema },
    } = this._tool;
    return tool((input, { toolCall, context }) => invoke(context.ctx, input, toolCall.id), {
      name,
      description,
      schema,
      returnDirect: false,
    });
  }
}
//# sourceMappingURL=provider.js.map
