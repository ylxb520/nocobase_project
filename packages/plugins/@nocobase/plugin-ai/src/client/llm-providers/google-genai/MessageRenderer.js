/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Markdown } from '../../ai-employees/chatbox/markdown/Markdown';
import { ToolCard } from '../../ai-employees/chatbox/generative-ui/ToolCard';
export const MessageRenderer = ({ msg }) => {
  let content = msg.content;
  if (Array.isArray(content)) {
    content = content.find((item) => item.type === 'text')?.text;
  }
  return React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      },
    },
    typeof content === 'string' &&
      React.createElement(Markdown, {
        message: {
          ...msg,
          // @ts-ignore
          content,
        },
      }),
    msg.tool_calls?.length
      ? React.createElement(ToolCard, { toolCalls: msg.tool_calls, messageId: msg.messageId })
      : null,
  );
};
//# sourceMappingURL=MessageRenderer.js.map
