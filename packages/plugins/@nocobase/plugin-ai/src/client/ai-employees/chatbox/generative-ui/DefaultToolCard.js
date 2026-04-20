/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Tooltip, Flex } from 'antd';
import { useT } from '../../../locale';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  MinusCircleFilled,
  QuestionCircleOutlined,
  CheckOutlined,
  RightOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { toToolsMap, useToken, lazy } from '@nocobase/client';
import { Schema } from '@formily/react';
import { useToolCallActions } from '../hooks/useToolCallActions';
import { useChatMessagesStore } from '../stores/chat-messages';
import { css, keyframes } from '@emotion/css';
const { CodeHighlight } = lazy(() => import('../../common/CodeHighlight'), 'CodeHighlight');
const loadingTextShimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: 0 0;
  }
`;
const CallButton = ({ messageId, toolCalls }) => {
  const t = useT();
  const { token } = useToken();
  const { getDecisionActions } = useToolCallActions({ messageId });
  const [loading, setLoading] = useState(false);
  return React.createElement(
    Flex,
    { align: 'center', gap: 8 },
    React.createElement(
      Button,
      {
        loading: loading,
        onClick: async (e) => {
          e.stopPropagation();
          setLoading(true);
          for (const toolCall of toolCalls) {
            const decision = getDecisionActions(toolCall);
            await decision.approve();
          }
          setLoading(false);
        },
        variant: 'text',
        color: 'primary',
        size: 'small',
        icon: React.createElement(CheckOutlined, null),
        style: {
          height: token.controlHeightSM,
          paddingInline: token.paddingSM,
          fontSize: token.fontSizeSM + 1,
        },
      },
      t('Allow use'),
    ),
  );
};
const InvokeStatus = ({ toolCall }) => {
  const t = useT();
  const { token } = useToken();
  const { invokeStatus } = toolCall;
  switch (invokeStatus) {
    case 'init':
    case 'interrupted':
    case 'waiting':
      return React.createElement(
        Tooltip,
        { title: t('invoke-status-init') },
        React.createElement(MinusCircleFilled, { style: { color: token.colorTextQuaternary } }),
      );
    case 'pending':
      return React.createElement(
        Tooltip,
        { title: t('invoke-status-pending') },
        React.createElement(ClockCircleFilled, { style: { color: token.colorTextSecondary } }),
      );
    case 'done':
    case 'confirmed':
      return toolCall.status === 'error'
        ? React.createElement(
            Tooltip,
            { title: t('invoke-status-error') },
            React.createElement(CloseCircleFilled, { style: { color: token.colorError } }),
          )
        : React.createElement(
            Tooltip,
            { title: t('invoke-status-success') },
            React.createElement(CheckCircleFilled, { style: { color: token.colorSuccess } }),
          );
  }
};
const ToolCallRow = ({ toolCall, toolsMap, generating, defaultExpanded, rightExtra }) => {
  const t = useT();
  const { token } = useToken();
  const [expanded, setExpanded] = useState(!!defaultExpanded);
  useEffect(() => {
    if (defaultExpanded) {
      setExpanded(true);
    }
  }, [defaultExpanded]);
  let args = toolCall.args;
  try {
    args = JSON.stringify(args, null, 2);
  } catch (err) {
    // ignore
  }
  const toolsEntry = toolsMap.get(toolCall.name);
  const title = toolsEntry?.introduction?.title
    ? Schema.compile(toolsEntry?.introduction?.title, { t })
    : toolCall.name;
  const description = toolsEntry?.introduction?.about
    ? Schema.compile(toolsEntry?.introduction?.about, { t })
    : toolCall.name;
  const titleLoadingClass = css({
    backgroundImage: `linear-gradient(90deg, ${token.colorTextTertiary} 0%, ${token.colorText} 45%, ${token.colorTextTertiary} 100%)`,
    backgroundSize: '160% 100%',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    opacity: 0.98,
    animation: `${loadingTextShimmer} 1.6s linear infinite`,
    willChange: 'background-position',
  });
  const showLoadingTitle = generating && toolCall.invokeStatus !== 'done' && toolCall.invokeStatus !== 'confirmed';
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px 0 4px',
          cursor: 'pointer',
          userSelect: 'none',
        },
        onClick: () => {
          if (args === '{}') {
            return;
          }
          setExpanded(!expanded);
        },
      },
      React.createElement(
        Flex,
        { align: 'center', gap: 8 },
        React.createElement(InvokeStatus, { toolCall: toolCall }),
        React.createElement(
          'span',
          { style: { fontSize: token.fontSizeSM + 1, color: token.colorTextSecondary } },
          React.createElement('span', { className: showLoadingTitle ? titleLoadingClass : undefined }, title),
          toolsEntry?.introduction?.about &&
            React.createElement(
              React.Fragment,
              null,
              ' ',
              React.createElement(
                Tooltip,
                { title: description },
                React.createElement(QuestionCircleOutlined, { style: { color: token.colorTextQuaternary } }),
              ),
            ),
        ),
      ),
      React.createElement(
        Flex,
        { align: 'center', gap: 8 },
        args !== '{}'
          ? expanded
            ? React.createElement(UpOutlined, { style: { fontSize: token.fontSizeSM, color: token.colorTextTertiary } })
            : React.createElement(RightOutlined, {
                style: { fontSize: token.fontSizeSM, color: token.colorTextTertiary },
              })
          : null,
        rightExtra
          ? React.createElement(
              'div',
              {
                onClick: (event) => event.stopPropagation(),
                onMouseDown: (event) => event.stopPropagation(),
                style: { display: 'flex', alignItems: 'center' },
              },
              rightExtra,
            )
          : null,
      ),
    ),
    expanded &&
      React.createElement(
        'div',
        { style: { padding: '4px 12px', fontSize: token.fontSizeSM } },
        React.createElement(CodeHighlight, { language: 'json', value: args }),
      ),
  );
};
export const DefaultToolCard = ({ messageId, tools, toolCalls, inlineActions }) => {
  const toolsMap = toToolsMap(tools);
  const messages = useChatMessagesStore.use.messages();
  const responseLoading = useChatMessagesStore.use.responseLoading();
  const generating = responseLoading && messages[messages.length - 1]?.content?.messageId === messageId;
  const hasAutoExpanded = useRef(false);
  const showCallButton =
    messageId &&
    !toolCalls.every((tool) => tool.auto) &&
    !toolCalls.every((tool) => tool.invokeStatus === 'done' || tool.invokeStatus === 'confirmed' || !tool.invokeStatus);
  const shouldAutoExpand = showCallButton && !hasAutoExpanded.current;
  useEffect(() => {
    if (showCallButton) {
      hasAutoExpanded.current = true;
    }
  }, [showCallButton]);
  const singleInlineActions = inlineActions && toolCalls.length === 1 ? inlineActions : null;
  return React.createElement(
    Flex,
    { vertical: true },
    toolCalls.map((toolCall) =>
      React.createElement(ToolCallRow, {
        key: toolCall.id,
        toolCall: toolCall,
        toolsMap: toolsMap,
        generating: generating,
        defaultExpanded: shouldAutoExpand,
        rightExtra: singleInlineActions,
      }),
    ),
    showCallButton && React.createElement(CallButton, { messageId: messageId, toolCalls: toolCalls }),
  );
};
//# sourceMappingURL=DefaultToolCard.js.map
