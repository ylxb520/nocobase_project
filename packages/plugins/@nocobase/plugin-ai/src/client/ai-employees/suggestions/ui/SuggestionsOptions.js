/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState } from 'react';
import { useChatMessagesStore } from '../../chatbox/stores/chat-messages';
import { Button, Flex, Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useT } from '../../../locale';
export const SuggestionsOptions = ({ messageId, toolCall, decisions }) => {
  const t = useT();
  const responseLoading = useChatMessagesStore.use.responseLoading();
  const messages = useChatMessagesStore.use.messages();
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState(null);
  const generating = responseLoading && messages[length - 1]?.content.messageId === messageId;
  const btnStyle = { whiteSpace: 'normal', textAlign: 'left', height: 'auto', borderWidth: 1 };
  const defaultBtnProps = {
    style: {
      ...btnStyle,
    },
    color: 'default',
    variant: 'outlined',
  };
  const selectedBtnProps = {
    style: {
      ...btnStyle,
      borderWidth: 2,
    },
    color: 'default',
    variant: 'dashed',
  };
  const btnProps = (option) =>
    toolCall.selectedSuggestion === option || selected === option ? selectedBtnProps : defaultBtnProps;
  const optionsInArgs = toolCall.args?.options ?? [];
  let options = [];
  if (typeof optionsInArgs === 'string') {
    try {
      options = JSON.parse(optionsInArgs);
    } catch (e) {
      console.log(`fail to convert args from tool call ${toolCall.name}`, toolCall.args);
    }
  } else {
    options = optionsInArgs;
  }
  return generating
    ? React.createElement(
        Space,
        null,
        React.createElement(Spin, { indicator: React.createElement(LoadingOutlined, { spin: true }), size: 'small' }),
        ' ',
        t('Generating...'),
      )
    : React.createElement(
        Flex,
        { align: 'flex-start', gap: 'middle', wrap: true },
        options.map((option, index) =>
          React.createElement(
            Button,
            {
              key: index,
              disabled: toolCall.invokeStatus !== 'interrupted' || disabled,
              ...btnProps(option),
              onClick: () => {
                if (disabled) {
                  return;
                }
                setDisabled(true);
                setSelected(option);
                decisions.edit({ ...(toolCall.args ?? {}), option });
              },
            },
            React.createElement('div', null, option),
          ),
        ),
      );
};
//# sourceMappingURL=SuggestionsOptions.js.map
