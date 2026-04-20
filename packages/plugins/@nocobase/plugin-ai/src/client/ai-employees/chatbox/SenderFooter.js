/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef } from 'react';
import { Flex } from 'antd';
import { Upload } from './Upload';
import { AddContextButton } from '../AddContextButton';
import { useChatMessagesStore } from './stores/chat-messages';
import { useChatBoxStore } from './stores/chat-box';
import _ from 'lodash';
import { SearchSwitch } from './SearchSwitch';
import { ModelSwitcher } from './ModelSwitcher';
import { AIEmployeeSwitcher } from './AIEmployeeSwitch';
export const SenderFooter = ({ components, handleSubmit }) => {
  const { SendButton, LoadingButton } = components;
  const senderButtonRef = useRef(null);
  const currentEmployee = useChatBoxStore.use.currentEmployee?.();
  const loading = useChatMessagesStore.use.responseLoading();
  const addContextItems = useChatMessagesStore.use.addContextItems();
  const removeContextItem = useChatMessagesStore.use.removeContextItem();
  const senderValue = useChatBoxStore.use.senderValue();
  const contextItems = useChatMessagesStore.use.contextItems();
  const handleEmptySubmit = () => {
    if (_.isEmpty(senderValue) && contextItems.length) {
      handleSubmit('');
    }
  };
  const senderRef = useChatBoxStore.use.senderRef();
  useEffect(() => {
    if (senderRef?.current?.nativeElement) {
      senderRef.current.nativeElement.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (_.isEmpty(senderValue) && contextItems.length) {
            senderButtonRef.current?.click();
          }
        }
      };
    }
  }, [senderRef, senderValue, contextItems]);
  return React.createElement(
    Flex,
    { justify: 'space-between', align: 'center' },
    React.createElement(
      Flex,
      { gap: 'middle', align: 'center' },
      React.createElement(AddContextButton, {
        onAdd: addContextItems,
        onRemove: removeContextItem,
        disabled: !currentEmployee,
        ignore: (key) => key === 'flow-model.variable',
      }),
      React.createElement(Upload, null),
      React.createElement(SearchSwitch, null),
      React.createElement(AIEmployeeSwitcher, null),
      React.createElement(ModelSwitcher, null),
    ),
    React.createElement(
      Flex,
      { align: 'center', gap: 'middle' },
      loading
        ? React.createElement(LoadingButton, { type: 'default' })
        : React.createElement(SendButton, {
            ref: senderButtonRef,
            type: 'primary',
            disabled: false,
            onClick: handleEmptySubmit,
          }),
    ),
  );
};
//# sourceMappingURL=SenderFooter.js.map
