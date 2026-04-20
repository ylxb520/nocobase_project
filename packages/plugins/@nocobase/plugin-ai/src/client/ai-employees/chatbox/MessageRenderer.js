/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { memo, useEffect, useMemo } from 'react';
import { Button, Space, App, Alert, Flex, Collapse, Typography, Tooltip } from 'antd';
import { CopyOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { Attachments, Bubble } from '@ant-design/x';
import { useT } from '../../locale';
import { lazy, usePlugin, useToken, toToolsMap } from '@nocobase/client';
import { cx, css } from '@emotion/css';
import { ContextItem } from './ContextItem';
import { ToolCard } from './generative-ui/ToolCard';
import { useChatConversationsStore } from './stores/chat-conversations';
import { useChatMessageActions } from './hooks/useChatMessageActions';
import { useChatBoxStore } from './stores/chat-box';
import { useChatMessagesStore } from './stores/chat-messages';
import { useChatBoxActions } from './hooks/useChatBoxActions';
import _ from 'lodash';
import { useAIConfigRepository } from '../../repositories/hooks/useAIConfigRepository';
import { observer } from '@nocobase/flow-engine';
const { Markdown } = lazy(() => import('./markdown/Markdown'), 'Markdown');
const { Link } = Typography;
const messageFooterWeakClass = css`
  margin-top: 4px;
  display: flex;
`;
const MessageWrapper = React.forwardRef(({ children, footer, ...props }, ref) => {
  return React.createElement(
    'div',
    { ref: ref, ...props },
    children,
    footer && React.createElement('div', { className: messageFooterWeakClass }, footer),
  );
});
const AITextMessageRenderer = ({ msg, toolInlineActions }) => {
  const plugin = usePlugin('ai');
  const provider = plugin.aiManager.llmProviders.get(msg.metadata?.provider);
  if (!provider?.components?.MessageRenderer) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
        },
      },
      typeof msg.content === 'string' && React.createElement(Markdown, { message: msg }),
      msg.tool_calls?.length
        ? React.createElement(ToolCard, {
            toolCalls: msg.tool_calls,
            messageId: msg.messageId,
            inlineActions: toolInlineActions,
          })
        : null,
    );
  }
  const M = provider.components.MessageRenderer;
  return React.createElement(M, { msg: msg });
};
const AIMessageRenderer = ({ msg, toolInlineActions }) => {
  switch (msg.type) {
    case 'greeting':
      return React.createElement(Bubble, {
        content: msg.content,
        style: {
          marginBottom: '8px',
        },
      });
    default:
      return React.createElement(Bubble, {
        styles: {
          content: {
            width: '100%',
            minHeight: 0,
          },
        },
        variant: 'borderless',
        content: React.createElement(AITextMessageRenderer, { msg: msg, toolInlineActions: toolInlineActions }),
      });
  }
};
export const AIMessage = observer(({ msg }) => {
  const t = useT();
  const { token } = useToken();
  const { message } = App.useApp();
  const aiConfigRepository = useAIConfigRepository();
  const toolsLoading = aiConfigRepository.aiToolsLoading;
  const tools = aiConfigRepository.aiTools;
  const toolsMap = useMemo(() => toToolsMap(tools || []), [tools]);
  useEffect(() => {
    aiConfigRepository.getAITools();
  }, [aiConfigRepository]);
  const plugin = usePlugin('ai');
  const provider = plugin.aiManager.llmProviders.get(msg.metadata?.provider);
  const hasCustomRenderer = !!provider?.components?.MessageRenderer;
  const footerButtonStyle = {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    height: token.controlHeightSM,
    padding: `0 ${token.paddingXS}px`,
  };
  const footerIconStyle = {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
  };
  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    message.success(t('Copied'));
  };
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const currentConversation = useChatConversationsStore.use.currentConversation();
  const { resendMessages } = useChatMessageActions();
  const usageMetadata = msg.metadata?.usage_metadata;
  const hasTextContent = typeof msg.content === 'string' && msg.content.trim().length > 0;
  const hasSingleToolCall = msg.tool_calls?.length === 1;
  const toolCall = hasSingleToolCall ? msg.tool_calls?.[0] : undefined;
  const isDefaultToolCard = !!toolCall && !toolsLoading && !toolsMap.get(toolCall.name)?.ui?.card;
  const useInlineToolActions = !hasCustomRenderer && hasSingleToolCall && !hasTextContent && isDefaultToolCard;
  const messageActions =
    msg.type !== 'greeting'
      ? React.createElement(
          Space,
          null,
          React.createElement(Button, {
            color: 'default',
            variant: 'text',
            size: 'small',
            style: footerButtonStyle,
            icon: React.createElement(ReloadOutlined, {
              style: footerIconStyle,
              onClick: () =>
                resendMessages({
                  sessionId: currentConversation,
                  messageId: msg.messageId,
                  aiEmployee: currentEmployee,
                }),
            }),
          }),
          typeof msg.content === 'string' &&
            msg.content &&
            React.createElement(Button, {
              color: 'default',
              variant: 'text',
              size: 'small',
              style: footerButtonStyle,
              icon: React.createElement(CopyOutlined, { style: footerIconStyle, onClick: copy }),
            }),
        )
      : null;
  return React.createElement(
    MessageWrapper,
    { ref: msg.ref, footer: messageActions && !useInlineToolActions ? messageActions : null },
    msg.reference?.length ? React.createElement(Reference, { references: msg.reference }) : null,
    React.createElement(AIMessageRenderer, {
      msg: msg,
      toolInlineActions: useInlineToolActions ? messageActions : null,
    }),
  );
});
export const Reference = ({ references }) => {
  const t = useT();
  const items = [
    {
      key: '1',
      label: t('Cite {{count}} pieces of information as references', { count: references.length }),
      children: React.createElement(
        Space,
        { style: { width: '100%' }, direction: 'vertical' },
        references.map((ref, index) => {
          const url = ref.url;
          const title = _.isEmpty(ref.title) ? t('references {{index}}', { index: index + 1 }) : ref.title;
          const tooltip = _.isEmpty(ref.title) ? ref.url : ref.title;
          return React.createElement(
            Tooltip,
            { key: index, title: tooltip, arrow: false },
            React.createElement(Link, { href: url, target: '_blank', ellipsis: true }, title),
          );
        }),
      ),
    },
  ];
  return React.createElement(Collapse, { items: items, bordered: false, size: 'small', style: { marginBottom: 8 } });
};
export const UserMessage = memo(({ msg }) => {
  const t = useT();
  const { token } = useToken();
  const { message } = App.useApp();
  const footerButtonStyle = {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    height: token.controlHeightSM,
    padding: `0 ${token.paddingXS}px`,
  };
  const footerIconStyle = {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
  };
  const setSenderValue = useChatBoxStore.use.setSenderValue();
  const senderRef = useChatBoxStore.use.senderRef();
  const { startEditingMessage } = useChatMessageActions();
  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    message.success(t('Copied'));
  };
  const items = msg.attachments?.map((item, index) => ({
    uid: index.toString(),
    name: item.filename,
    status: 'done',
    url: item.url,
    size: item.size,
    thumbUrl: item.preview,
    ...item,
  }));
  return React.createElement(
    MessageWrapper,
    {
      ref: msg.ref,
      className: cx(css`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      `),
      footer: React.createElement(
        Space,
        null,
        React.createElement(Button, {
          color: 'default',
          variant: 'text',
          size: 'small',
          style: footerButtonStyle,
          icon: React.createElement(EditOutlined, {
            style: footerIconStyle,
            onClick: () => {
              startEditingMessage(msg);
              setSenderValue(msg.content);
              senderRef.current?.focus();
            },
          }),
        }),
        typeof msg.content === 'string' &&
          msg.content &&
          React.createElement(Button, {
            color: 'default',
            variant: 'text',
            size: 'small',
            style: footerButtonStyle,
            icon: React.createElement(CopyOutlined, { style: footerIconStyle, onClick: copy }),
          }),
      ),
    },
    msg.workContext?.length
      ? React.createElement(
          'div',
          {
            style: {
              marginBottom: '4px',
            },
          },
          msg.workContext.map((item) =>
            React.createElement(ContextItem, { within: 'chatbox', item: item, key: `${item.type}:${item.uid}` }),
          ),
        )
      : null,
    items?.length
      ? React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 4,
            },
          },
          items.map((item) => React.createElement(Attachments.FileCard, { key: item.uid, item: item })),
        )
      : null,
    _.isEmpty(msg.content)
      ? React.createElement(React.Fragment, null)
      : React.createElement(Bubble, {
          content: msg.content,
          styles: {
            content: {
              whiteSpace: 'pre-wrap',
            },
          },
        }),
  );
});
export const ErrorMessage = memo(({ msg }) => {
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const currentConversation = useChatConversationsStore.use.currentConversation();
  const messages = useChatMessagesStore.use.messages();
  const { resendMessages } = useChatMessageActions();
  const showAlert = msg.content !== 'GraphRecursionError';
  useEffect(() => {
    if (msg.content === 'GraphRecursionError') {
      resendMessages({
        sessionId: currentConversation,
        aiEmployee: currentEmployee,
        important: msg.content,
      });
    }
  }, [msg]);
  return (
    showAlert &&
    React.createElement(Alert, {
      message: React.createElement(React.Fragment, null, msg.content, ' '),
      action: React.createElement(Button, {
        onClick: () => {
          let messageId;
          const prev = messages[messages.length - 2];
          if (prev && prev.role !== 'user') {
            messageId = prev.key;
          }
          resendMessages({
            sessionId: currentConversation,
            messageId,
            aiEmployee: currentEmployee,
          });
        },
        icon: React.createElement(ReloadOutlined, null),
        type: 'text',
      }),
      type: 'warning',
      showIcon: true,
    })
  );
});
export const HintMessage = memo(({ msg }) => {
  return React.createElement(Alert, {
    style: { marginBottom: 8 },
    message: React.createElement(React.Fragment, null, msg.content, ' '),
    type: 'info',
    showIcon: true,
    closable: true,
  });
});
export const TaskMessage = memo(({ msg }) => {
  const t = useT();
  // 保证 msg.content 始终被归一化为数组
  const rawTasks = msg?.content;
  const tasks = Array.isArray(rawTasks) ? rawTasks : rawTasks ? [rawTasks] : [];
  const taskVariables = useChatBoxStore.use.taskVariables();
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const { triggerTask } = useChatBoxActions();
  const tasksItems = tasks
    .map((task, index) => ({ ...task, title: task.title || `${t('Task')} ${index + 1}` }))
    .sort((a, b) => (b.title?.length ?? 0) - (a.title?.length ?? 0));
  return React.createElement(
    Flex,
    { align: 'flex-start', gap: 'middle', wrap: true },
    tasksItems.map((task, index) =>
      React.createElement(
        Button,
        {
          key: index,
          style: {
            whiteSpace: 'normal',
            textAlign: 'left',
            height: 'auto',
          },
          variant: 'outlined',
          onClick: () =>
            triggerTask({
              aiEmployee: currentEmployee,
              tasks: [task],
              ...taskVariables,
            }),
        },
        React.createElement('div', null, task.title),
      ),
    ),
  );
});
//# sourceMappingURL=MessageRenderer.js.map
