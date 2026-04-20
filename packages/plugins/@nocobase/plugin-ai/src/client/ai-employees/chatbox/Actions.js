/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo } from 'react';
import { usePlugin } from '@nocobase/client';
import { Button } from 'antd';
import { Schema } from '@formily/react';
import { useT } from '../../locale';
import { useChatMessagesStore } from './stores/chat-messages';
import { useChatBoxStore } from './stores/chat-box';
export const Actions = ({ responseType, message, value }) => {
  const t = useT();
  const plugin = usePlugin('ai');
  const messages = useChatMessagesStore.use.messages();
  const responseLoading = useChatMessagesStore.use.responseLoading();
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const reversedMessages = [...messages].reverse();
  const lastMessage = reversedMessages.find((msg) => msg.role === currentEmployee.username);
  const actions = useMemo(() => {
    const message = reversedMessages.find((msg) => msg.content.workContext?.length > 0);
    if (!message) {
      return [];
    }
    const workContext = message.content.workContext;
    const result = [];
    for (const context of workContext) {
      const options = plugin.aiManager.getWorkContext(context.type);
      if (!options) {
        continue;
      }
      const actions = options.actions;
      if (!actions?.length) {
        continue;
      }
      for (const action of actions) {
        if (action.responseType && action.responseType !== responseType) {
          continue;
        }
        result.push({
          ...action,
          context,
        });
      }
    }
    return result;
  }, [reversedMessages, responseType]);
  if (responseLoading || !actions.length || message.messageId !== lastMessage.key) {
    return null;
  }
  return React.createElement(
    'div',
    {
      style: {
        marginTop: '8px',
      },
    },
    actions.map((action, index) => {
      const C = action.Component;
      return C
        ? React.createElement(C, { item: action.context, message: message, value: value })
        : React.createElement(
            Button,
            {
              size: 'small',
              key: index,
              icon: action.icon,
              onClick: () => action.onClick?.({ item: action.context, message, value }),
            },
            Schema.compile(action.title, { t }),
          );
    }),
  );
};
//# sourceMappingURL=Actions.js.map
