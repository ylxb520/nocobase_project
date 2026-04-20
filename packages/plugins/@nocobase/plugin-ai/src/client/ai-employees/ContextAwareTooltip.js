/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useState } from 'react';
import { observer } from '@nocobase/flow-engine';
import { useT } from '../locale';
import { Avatar, Flex } from 'antd';
import { contextAware } from './stores/context-aware';
import { avatars } from './avatars';
import { useRequest, useToken } from '@nocobase/client';
import { useAIConfigRepository } from '../repositories/hooks/useAIConfigRepository';
export const ContextAwareTooltip = observer(() => {
  const t = useT();
  const aiConfigRepository = useAIConfigRepository();
  useRequest(async () => {
    return aiConfigRepository.getAIEmployees();
  });
  const aiEmployeesMap = aiConfigRepository.getAIEmployeesMap();
  const { token } = useToken();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!contextAware.aiEmployees.length) {
      setShow(false);
      return;
    }
    setShow(true);
    const timer = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(timer);
  }, [contextAware.aiEmployees.length]);
  return show
    ? React.createElement(
        'div',
        {
          style: {
            position: 'fixed',
            right: '8px',
            bottom: '108px',
            backgroundColor: token.colorPrimary,
            color: token.colorWhite,
            padding: '8px 6px',
            borderRadius: token.borderRadius,
            zIndex: 2000,
          },
        },
        React.createElement(
          Flex,
          { align: 'center', gap: 8 },
          React.createElement(
            Avatar.Group,
            null,
            contextAware.aiEmployees.map(({ username }) => {
              const aiEmployee = aiEmployeesMap[username];
              return React.createElement(Avatar, { src: avatars(aiEmployee?.avatar), key: username });
            }),
          ),
          React.createElement('div', null, t('Hi, let’s see how we can assist you.')),
        ),
      )
    : null;
});
//# sourceMappingURL=ContextAwareTooltip.js.map
