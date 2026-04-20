/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Card, Typography, Button, App, Space, Tooltip, Divider } from 'antd';
import { CloseOutlined, CodeOutlined, CopyOutlined, ExpandOutlined } from '@ant-design/icons';
import { lazy } from '@nocobase/client';
import { useFlowContext, useFlowViewContext } from '@nocobase/flow-engine';
import { useChatMessagesStore } from '../../chatbox/stores/chat-messages';
import { useT } from '../../../locale';
const { CodeHighlight } = lazy(() => import('../../common/CodeHighlight'), 'CodeHighlight');
export const CodeInternal = ({ language, value, height, scrollToBottom, ...rest }) =>
  React.createElement(CodeHighlight, {
    ...rest,
    language: language,
    value: value,
    height: height,
    scrollToBottom: scrollToBottom,
  });
export const Code = (props) => {
  const ctx = useFlowContext();
  const t = useT();
  const { children, className, node, message, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const value = String(children)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\n$/, '');
  const { message: antdMessage } = App.useApp();
  const copy = () => {
    navigator.clipboard.writeText(value);
    antdMessage.success(t('Copied'));
  };
  let isFullText = true;
  if (message?.type === 'text') {
    const pattern = new RegExp('```' + language + '[\\s\\S]*?```', 's');
    isFullText = pattern.test(message.content);
  }
  const editorRefMap = useChatMessagesStore.use.editorRef();
  const currentEditorRefUid = useChatMessagesStore.use.currentEditorRefUid();
  const editorRef = editorRefMap[currentEditorRefUid];
  return match
    ? React.createElement(
        Card,
        {
          type: 'inner',
          size: 'small',
          title: React.createElement(
            Space,
            { style: { margin: '0 8px' }, size: 'middle' },
            React.createElement(CodeOutlined, null),
            React.createElement('span', null, language),
          ),
          extra: React.createElement(
            React.Fragment,
            null,
            React.createElement(
              Tooltip,
              { title: t('Copy') },
              React.createElement(Button, {
                type: 'text',
                icon: React.createElement(CopyOutlined, null),
                onClick: copy,
              }),
            ),
            React.createElement(Divider, { type: 'vertical' }),
            React.createElement(
              Tooltip,
              { title: t('Expand') },
              React.createElement(Button, {
                type: 'text',
                icon: React.createElement(ExpandOutlined, null),
                onClick: () => {
                  ctx.viewer.dialog({
                    width: '80%',
                    zIndex: 6000,
                    content: React.createElement(CodeViewExpanded, {
                      ...rest,
                      language: language,
                      value: value,
                      height: '75vh',
                    }),
                  });
                },
              }),
            ),
          ),
          styles: { header: { padding: 0 }, body: { padding: 0 } },
          actions: editorRef
            ? [
                React.createElement(
                  Button,
                  {
                    key: 'accept',
                    type: 'link',
                    onClick: (e) => {
                      e.stopPropagation();
                      editorRef?.write(value);
                      ctx.message.info(t('Applied'));
                    },
                    disabled: !isFullText,
                  },
                  t('Apply to editor'),
                ),
              ]
            : [],
        },
        React.createElement(CodeInternal, { ...rest, language: language, value: value, scrollToBottom: !isFullText }),
      )
    : React.createElement(Typography.Text, { code: true, ...rest, className: className }, children);
};
const CodeViewExpanded = ({ language, value, ...rest }) => {
  const ctx = useFlowViewContext();
  const { Header } = ctx.view;
  const closeBtn = React.createElement(Button, {
    type: 'text',
    icon: React.createElement(CloseOutlined, null),
    onClick: () => {
      ctx.view.close();
    },
  });
  return React.createElement(
    'div',
    { style: { borderRadius: 8 } },
    React.createElement(Header, {
      title: React.createElement(
        React.Fragment,
        null,
        React.createElement(Space, null, closeBtn, React.createElement('span', null, language)),
      ),
    }),
    React.createElement(CodeInternal, { ...rest, language: language, value: value }),
  );
};
//# sourceMappingURL=Code.js.map
