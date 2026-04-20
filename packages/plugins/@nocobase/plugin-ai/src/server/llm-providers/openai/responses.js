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
import { stripToolCallTags } from '../../utils';
export class OpenAIResponsesProvider extends LLMProvider {
  get baseURL() {
    return 'https://api.openai.com/v1';
  }
  createModel() {
    const { baseURL, apiKey } = this.serviceOptions || {};
    const { responseFormat, structuredOutput } = this.modelOptions || {};
    const { schema } = structuredOutput || {};
    const responseFormatOptions = {
      type: responseFormat ?? 'text',
    };
    if (responseFormat === 'json_schema' && schema) {
      responseFormatOptions['name'] = 'default';
      responseFormatOptions['schema'] = schema;
    }
    return new ChatOpenAI({
      apiKey,
      ...this.modelOptions,
      modelKwargs: {
        text: {
          format: responseFormatOptions,
        },
      },
      configuration: {
        baseURL: baseURL || this.baseURL,
      },
      verbose: false,
      useResponsesApi: true,
    });
  }
  parseResponseChunk(chunk) {
    if (chunk && Array.isArray(chunk)) {
      if (chunk[0] && chunk[0].type === 'text') {
        chunk = chunk[0].text;
      }
    }
    return stripToolCallTags(chunk);
  }
  parseResponseMessage(message) {
    const { content: rawContent, messageId, metadata, role, toolCalls, attachments, workContext } = message;
    const content = {
      ...rawContent,
      messageId,
      metadata,
      attachments,
      workContext,
    };
    if (toolCalls) {
      content.tool_calls = toolCalls;
    }
    if (Array.isArray(content.content)) {
      const textMessage = content.content.find((msg) => msg.type === 'text');
      content.content = textMessage?.text;
      // get web search results from openai response's annotations
      if (textMessage?.annotations?.length) {
        content.reference = content.reference ?? [];
        for (const annotation of textMessage?.annotations ?? []) {
          content.reference.push({
            title: annotation.title,
            url: annotation.url,
          });
        }
      }
    }
    if (metadata?.response_metadata?.output?.length) {
      content.reference = content.reference ?? [];
      const output = metadata.response_metadata.output.find((it) => it.type === 'message');
      if (output?.content?.length) {
        const outputContent = output.content.find((it) => it.type === 'output_text');
        for (const annotation of outputContent?.annotations ?? []) {
          content.reference.push({
            title: annotation.title,
            url: annotation.url,
          });
        }
      }
    }
    return {
      key: messageId,
      content,
      role,
    };
  }
  builtInTools() {
    if (this.modelOptions?.builtIn?.webSearch === true) {
      const webSearchTool = {
        type: 'web_search_preview',
      };
      return [webSearchTool];
    }
    return [];
  }
  isToolConflict() {
    return false;
  }
  parseWebSearchAction(chunk) {
    const tool_outputs = chunk?.additional_kwargs?.tool_outputs;
    if (!tool_outputs) {
      return [];
    }
    return tool_outputs
      .filter((tool) => tool.type === 'web_search_call')
      .filter((tool) => tool.action)
      .map((tool) => tool.action);
  }
}
//# sourceMappingURL=responses.js.map
