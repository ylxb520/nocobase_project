/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Tabs } from 'antd';
import { usePlugin } from '@nocobase/client';
import { Schema } from '@formily/react';
import { useT } from '../../locale';
export const Chat = () => {
  const t = useT();
  const plugin = usePlugin('ai');
  const chatSettings = Array.from(plugin.aiManager.chatSettings.entries());
  const items = chatSettings.map(([key, { title, Component }]) => ({
    key,
    label: Schema.compile(title, { t }),
    children: React.createElement(Component, null),
  }));
  return React.createElement(Tabs, { items: items });
};
//# sourceMappingURL=Chat.js.map
