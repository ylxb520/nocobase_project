/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Divider, Dropdown, Flex, Popover, Tag } from 'antd';
import { UserAddOutlined, CloseCircleOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import { useToken } from '@nocobase/client';
import { observer } from '@nocobase/flow-engine';
import { useT } from '../../locale';
import { AIEmployeeListItem } from '../AIEmployeeListItem';
import { avatars } from '../avatars';
import { ProfileCard } from '../ProfileCard';
import { AttachmentsHeader } from './AttachmentsHeader';
import { ContextItemsHeader } from './ContextItemsHeader';
import { useChatBoxStore } from './stores/chat-box';
import { useChatBoxActions } from './hooks/useChatBoxActions';
import { EditMessageHeader } from './EditMessageHeader';
import { useAIConfigRepository } from '../../repositories/hooks/useAIConfigRepository';
export const AIEmployeeSwitcher = observer(() => {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const aiConfigRepository = useAIConfigRepository();
  const aiEmployees = aiConfigRepository.aiEmployees;
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const { switchAIEmployee } = useChatBoxActions();
  const { token } = useToken();
  useEffect(() => {
    aiConfigRepository.getAIEmployees();
  }, [aiConfigRepository]);
  const menuItems = !aiEmployees.length
    ? [
        {
          key: 'empty',
          label: React.createElement(
            'span',
            { style: { fontSize: 12, color: token.colorTextSecondary } },
            t('Please choose an AI employee'),
          ),
          disabled: true,
          style: { cursor: 'default', padding: '16px 12px', height: 'auto', minHeight: 0 },
        },
      ]
    : aiEmployees.map((employee) => {
        const isSelected = currentEmployee?.username === employee.username;
        return {
          key: employee.username,
          label: React.createElement(
            'span',
            { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
            React.createElement(AIEmployeeListItem, { aiEmployee: employee }),
            isSelected && React.createElement(CheckOutlined, { style: { fontSize: 12, color: token.colorPrimary } }),
          ),
          onClick: () => switchAIEmployee(employee),
        };
      });
  const hasEmployees = aiEmployees.length > 0;
  const currentLabel = currentEmployee ? currentEmployee.nickname : `${t('Select an')} ${t('AI employee')}`;
  const dropdownContent = React.createElement(
    'span',
    {
      onClick: (e) => e.stopPropagation(),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 12,
        backgroundColor: token.colorFillTertiary,
        borderRadius: 6,
        height: 28,
        padding: '0 8px',
        cursor: 'pointer',
        userSelect: 'none',
      },
    },
    currentEmployee
      ? React.createElement(Avatar, { shape: 'circle', size: 20, src: avatars(currentEmployee.avatar) })
      : null,
    React.createElement(
      'span',
      {
        style: {
          color: hasEmployees ? token.colorText : token.colorError,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 160,
        },
      },
      currentLabel,
    ),
    React.createElement(DownOutlined, {
      style: { fontSize: 10, color: hasEmployees ? token.colorTextSecondary : token.colorError },
    }),
  );
  return React.createElement(
    Dropdown,
    {
      menu: { items: menuItems, style: { maxHeight: 400, overflow: 'auto' } },
      trigger: ['hover'],
      open: isOpen,
      onOpenChange: setIsOpen,
      overlayStyle: { zIndex: 1200 },
    },
    dropdownContent,
  );
});
export const SenderHeader = observer(() => {
  const aiConfigRepository = useAIConfigRepository();
  const aiEmployees = aiConfigRepository.aiEmployees;
  const { token } = useToken();
  const t = useT();
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const isEditingMessage = useChatBoxStore.use.isEditingMessage();
  const { switchAIEmployee } = useChatBoxActions();
  useEffect(() => {
    aiConfigRepository.getAIEmployees();
  }, [aiConfigRepository]);
  const items = aiEmployees?.map((employee) => ({
    key: employee.username,
    label: React.createElement(AIEmployeeListItem, {
      aiEmployee: employee,
      onClick: () => {
        switchAIEmployee(employee);
      },
    }),
  }));
  const avatar = useMemo(() => {
    if (!currentEmployee) {
      return null;
    }
    return avatars(currentEmployee.avatar);
  }, [currentEmployee]);
  return React.createElement(
    'div',
    {
      style: {
        padding: '8px 8px 0 8px',
      },
    },
    React.createElement(
      'div',
      null,
      isEditingMessage
        ? React.createElement('div', { style: { marginBottom: 8 } }, React.createElement(EditMessageHeader, null))
        : null,
      !currentEmployee
        ? React.createElement(
            Button,
            { variant: 'dashed', color: 'default', size: 'small' },
            React.createElement(
              'span',
              {
                style: {
                  color: token.colorTextDescription,
                },
              },
              React.createElement(UserAddOutlined, null),
              t('Select an'),
            ),
            React.createElement(
              Dropdown,
              { menu: { items }, placement: 'topLeft', overlayStyle: { zIndex: 1200 } },
              t('AI employee'),
            ),
          )
        : React.createElement(
            Tag,
            {
              closeIcon: React.createElement(
                'div',
                {
                  style: {
                    position: 'absolute',
                    top: 0,
                    right: '4px',
                  },
                },
                React.createElement(CloseCircleOutlined, null),
              ),
              onClose: () => {
                switchAIEmployee(null);
              },
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                background: token.colorBgContainer,
              },
            },
            React.createElement(
              Flex,
              { align: 'center' },
              React.createElement(
                Popover,
                { content: React.createElement(ProfileCard, { aiEmployee: currentEmployee }), placement: 'leftTop' },
                React.createElement(Avatar, {
                  style: {
                    margin: '4px 0',
                  },
                  shape: 'circle',
                  size: 35,
                  src: avatar,
                }),
              ),
              React.createElement(
                Flex,
                {
                  style: {
                    margin: '4px 12px',
                  },
                  align: 'center',
                },
                React.createElement('div', null, currentEmployee.nickname),
                React.createElement(Divider, { type: 'vertical' }),
                React.createElement(
                  'div',
                  {
                    style: {
                      fontSize: token.fontSizeSM,
                      color: token.colorTextSecondary,
                    },
                  },
                  currentEmployee.position,
                ),
              ),
            ),
          ),
    ),
    currentEmployee ? React.createElement(ContextItemsHeader, null) : null,
    currentEmployee ? React.createElement(AttachmentsHeader, null) : null,
  );
});
//# sourceMappingURL=AIEmployeeSwitch.js.map
