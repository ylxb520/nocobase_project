/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Avatar, Flex, Popover } from 'antd';
import { avatars } from './avatars';
import { useToken } from '@nocobase/client';
import { ProfileCard } from './ProfileCard';
export const AIEmployeeListItem = ({ aiEmployee, onClick }) => {
  const { token } = useToken();
  return React.createElement(
    Popover,
    { content: React.createElement(ProfileCard, { aiEmployee: aiEmployee }), placement: 'leftTop' },
    React.createElement(
      Flex,
      { align: 'center', onClick: onClick, style: { padding: '4px 2px' }, gap: 8 },
      React.createElement(Avatar, { shape: 'circle', size: 36, src: avatars(aiEmployee.avatar) }),
      React.createElement(
        Flex,
        { vertical: true },
        React.createElement(
          'div',
          {
            style: {
              fontSize: token.fontSizeSM,
              color: token.colorText,
              lineHeight: 1.4,
            },
          },
          aiEmployee.nickname,
        ),
        React.createElement(
          'div',
          {
            style: {
              fontSize: token.fontSizeSM,
              color: token.colorTextSecondary,
              lineHeight: 1.4,
            },
          },
          aiEmployee.position,
        ),
      ),
    ),
  );
};
//# sourceMappingURL=AIEmployeeListItem.js.map
