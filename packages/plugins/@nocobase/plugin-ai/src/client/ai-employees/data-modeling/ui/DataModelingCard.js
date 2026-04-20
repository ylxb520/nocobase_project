/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Card, Spin } from 'antd';
import { DatabaseOutlined, ExclamationCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useT } from '../../../locale';
import { useToken } from '@nocobase/client';
import { useChatToolsStore } from '../../chatbox/stores/chat-tools';
import { useChatMessagesStore } from '../../chatbox/stores/chat-messages';
export const DataModelingCard = ({ messageId, toolCall }) => {
  const t = useT();
  const { token } = useToken();
  const responseLoading = useChatMessagesStore.use.responseLoading();
  const messages = useChatMessagesStore.use.messages();
  const setOpen = useChatToolsStore.use.setOpenToolModal();
  const setActiveTool = useChatToolsStore.use.setActiveTool();
  const setActiveMessageId = useChatToolsStore.use.setActiveMessageId();
  const toolsByMessageId = useChatToolsStore.use.toolsByMessageId();
  const version = toolsByMessageId[messageId]?.[toolCall.id]?.version;
  const generating = responseLoading && messages[length - 1]?.content.messageId === messageId;
  let description = React.createElement(React.Fragment, null, t('Please review and finish the process'));
  if (generating) {
    description = React.createElement(
      React.Fragment,
      null,
      React.createElement(Spin, { indicator: React.createElement(LoadingOutlined, { spin: true }), size: 'small' }),
      ' ',
      t('Generating...'),
    );
  } else if (!toolCall.args.collections) {
    console.error('Invalid definition', toolCall.args);
    description = React.createElement(
      React.Fragment,
      null,
      React.createElement(ExclamationCircleTwoTone, { twoToneColor: '#eb2f96' }),
      ' ',
      t('Invalid definition'),
    );
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      Card,
      {
        style: {
          margin: '16px 0',
          cursor: 'pointer',
        },
        onClick: () => {
          if (generating || !toolCall.args.collections) {
            return;
          }
          setActiveTool(toolCall);
          setActiveMessageId(messageId);
          setOpen(true);
        },
      },
      React.createElement(Card.Meta, {
        avatar: React.createElement(DatabaseOutlined, null),
        title: React.createElement(
          React.Fragment,
          null,
          t('Data modeling'),
          version && version > 1
            ? React.createElement(
                'span',
                {
                  style: {
                    marginLeft: '8px',
                    color: token.colorTextDescription,
                    // fontSize: token.fontSizeSM,
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                  },
                },
                t('Version'),
                ' ',
                version,
              )
            : null,
        ),
        description: description,
      }),
    ),
  );
};
//# sourceMappingURL=DataModelingCard.js.map
