/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef } from 'react';
import { Bubble } from '@ant-design/x';
import { Spin, Layout } from 'antd';
import { useT } from '../../locale';
import { useToken } from '@nocobase/client';
import { useChatMessagesStore } from './stores/chat-messages';
import { useChatMessageActions } from './hooks/useChatMessageActions';
import { useChatBoxStore } from './stores/chat-box';
import { useChatToolsStore } from './stores/chat-tools';
export const Messages = () => {
  const t = useT();
  const { token } = useToken();
  const roles = useChatBoxStore.use.roles();
  const messages = useChatMessagesStore.use.messages();
  const updateTools = useChatToolsStore.use.updateTools();
  const { messagesService, lastMessageRef } = useChatMessageActions();
  useEffect(() => {
    updateTools(messages);
  }, [messages, updateTools]);
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      container.scrollTop = container.scrollHeight;
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [messages]);
  return React.createElement(
    Layout.Content,
    {
      ref: containerRef,
      style: {
        margin: '16px 0',
        overflow: 'auto',
        position: 'relative',
      },
    },
    messagesService.loading &&
      React.createElement(Spin, {
        style: {
          display: 'block',
          margin: '8px auto',
        },
      }),
    messages?.length
      ? React.createElement(
          'div',
          null,
          messages.map((msg, index) => {
            const role = roles[msg.role];
            if (!role) {
              return null;
            }
            return index === 0 && msg.content?.type !== 'greeting'
              ? React.createElement(
                  'div',
                  { key: msg.key, ref: lastMessageRef },
                  React.createElement(Bubble, { ...role, loading: msg.loading, content: msg.content }),
                )
              : React.createElement(Bubble, { ...role, key: msg.key, loading: msg.loading, content: msg.content });
          }),
        )
      : React.createElement(
          'div',
          {
            style: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: token.colorTextDescription,
            },
          },
          t('Work with your AI crew'),
        ),
  );
};
//# sourceMappingURL=Messages.js.map
