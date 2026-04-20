/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Avatar, Divider, Typography, Flex, Tag } from 'antd';
import { useToken } from '@nocobase/client';
import { avatars } from './avatars';
import { useChatBoxActions } from './chatbox/hooks/useChatBoxActions';
export const ProfileCard = ({ aiEmployee, tasks }) => {
  const { token } = useToken();
  tasks = tasks?.filter((task) => task.title) || [];
  const { triggerTask } = useChatBoxActions();
  if (!aiEmployee) {
    return null;
  }
  return React.createElement(
    'div',
    {
      style: {
        width: '260px',
        padding: '4px 8px',
      },
    },
    React.createElement(
      Flex,
      { align: 'center', gap: 10 },
      React.createElement(Avatar, {
        src: avatars(aiEmployee.avatar),
        size: 40,
        style: {
          flexShrink: 0,
        },
      }),
      React.createElement(
        Flex,
        { vertical: true },
        React.createElement(
          'span',
          {
            style: {
              fontSize: token.fontSize,
              color: token.colorText,
              lineHeight: 1.4,
            },
          },
          aiEmployee.nickname,
        ),
        React.createElement(
          'span',
          {
            style: {
              fontSize: token.fontSizeSM,
              color: token.colorTextTertiary,
              lineHeight: 1.4,
            },
          },
          aiEmployee.position,
        ),
      ),
    ),
    aiEmployee.bio
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(Divider, { style: { margin: '8px 0' } }),
          React.createElement(
            Typography.Paragraph,
            {
              style: {
                marginBottom: 0,
                fontSize: token.fontSizeSM,
                color: token.colorTextSecondary,
                lineHeight: 1.6,
              },
            },
            aiEmployee.bio,
          ),
        )
      : null,
    tasks.length
      ? React.createElement(
          Flex,
          {
            gap: '4px 4px',
            wrap: true,
            style: {
              marginTop: '8px',
            },
          },
          tasks.map((task, index) =>
            React.createElement(
              Tag,
              {
                key: index,
                style: {
                  cursor: 'pointer',
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                },
                onClick: () =>
                  triggerTask({
                    aiEmployee,
                    tasks: [task],
                  }),
              },
              task.title,
            ),
          ),
        )
      : null,
  );
};
//# sourceMappingURL=ProfileCard.js.map
