/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { avatars } from '../avatars';
import { Avatar } from 'antd';
import { useChatBoxStore } from './stores/chat-box';
import { useChatBoxActions } from './hooks/useChatBoxActions';
export const SenderPrefix = () => {
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const { switchAIEmployee } = useChatBoxActions();
  return currentEmployee
    ? React.createElement(Avatar, {
        src: avatars(currentEmployee.avatar),
        style: {
          cursor: 'pointer',
        },
        onClick: () => switchAIEmployee(null),
      })
    : null;
};
//# sourceMappingURL=SenderPrefix.js.map
