/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export const convertAIMessage = ({ aiEmployee, providerName: provider, model, aiMessage }) => {
  const message = aiMessage.content;
  const toolCalls = aiMessage.tool_calls;
  const skills = aiEmployee.skillSettings?.skills;
  if (!message && !toolCalls?.length) {
    return null;
  }
  // Extract text content and references from array content (e.g., Anthropic web search response)
  let textContent = message;
  let reference;
  if (Array.isArray(message)) {
    const textBlocks = message.filter((block) => block.type === 'text');
    textContent = textBlocks.map((block) => block.text).join('') || '';
    for (const block of message) {
      if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
        reference = reference || [];
        for (const item of block.content) {
          if (item.type === 'web_search_result' && item.url) {
            reference.push({ title: item.title || '', url: item.url });
          }
        }
      }
    }
  }
  const values = {
    role: aiEmployee.employee.username,
    content: {
      type: 'text',
      content: textContent,
      ...(reference?.length ? { reference } : {}),
    },
    metadata: {
      id: aiMessage.id,
      model,
      provider,
      usage_metadata: {},
    },
    toolCalls: null,
  };
  if (toolCalls?.length) {
    values.toolCalls = toolCalls;
    values.metadata.autoCallTools = toolCalls
      .filter((tool) => {
        return skills?.some((s) => s.name === tool.name && s.autoCall);
      })
      .map((tool) => tool.name);
  }
  if (aiMessage.usage_metadata) {
    values.metadata.usage_metadata = aiMessage.usage_metadata;
  }
  if (aiMessage.response_metadata) {
    values.metadata.response_metadata = aiMessage.response_metadata;
  }
  if (aiMessage.additional_kwargs) {
    values.metadata.additional_kwargs = aiMessage.additional_kwargs;
  }
  return values;
};
export const convertHumanMessage = ({ providerName: provider, model, humanMessage }) => {
  if (!humanMessage.additional_kwargs.userContent) {
    return null;
  }
  const values = {
    role: 'user',
    content: humanMessage.additional_kwargs?.userContent,
    metadata: {
      id: humanMessage.id,
      model,
      provider,
    },
  };
  values.attachments = humanMessage.additional_kwargs.attachments;
  values.workContext = humanMessage.additional_kwargs.workContext;
  return values;
};
export const convertToolMessage = ({ providerName: provider, model, toolMessage }) => {
  const values = {
    role: 'tool',
    content: {
      type: 'text',
      content: toolMessage.content,
    },
    metadata: {
      id: toolMessage.id,
      model,
      provider,
      toolCallId: toolMessage.tool_call_id,
      toolName: toolMessage.name,
    },
  };
  return values;
};
//# sourceMappingURL=utils.js.map
