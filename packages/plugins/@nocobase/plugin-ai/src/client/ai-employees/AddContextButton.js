/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
// @ts-nocheck
import React, { useMemo } from 'react';
import { Button, Dropdown } from 'antd';
import { useT } from '../locale';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Schema } from '@formily/react';
import { usePlugin } from '@nocobase/client';
import { useFlowContext } from '@nocobase/flow-engine';
const walkthrough = (workContexts, callback) => {
  const queue = workContexts.map((workContext) => ({ parent: null, workContext }));
  while (queue.length) {
    const { parent, workContext } = queue.shift();
    callback(parent, workContext);
    if (workContext.children) {
      queue.push(
        ...Object.entries(workContext.children).map(([name, child]) => ({
          parent: workContext.name,
          workContext: { name, ...child },
        })),
      );
    }
  }
};
export const AddContextButton = ({ contextItems, onAdd, onRemove, disabled, ignore }) => {
  const t = useT();
  const ctx = useFlowContext();
  const plugin = usePlugin('ai');
  const workContext = plugin.aiManager.workContext;
  const [items, onClick] = useMemo(() => {
    const context = Array.from(workContext.getValues());
    const menuItems = [];
    const menuItemMapping = new Map();
    const contextItemMapping = new Map();
    walkthrough(context, (parent, contextItem) => {
      if (!contextItem.menu) {
        return;
      }
      const key = parent ? `${parent}.${contextItem.name}` : contextItem.name;
      if (ignore?.(key, contextItem) ?? false) {
        return;
      }
      const C = contextItem.menu.Component;
      const item = {
        key,
        label: C ? React.createElement(C, null) : Schema.compile(contextItem.menu.label, { t }),
        icon: contextItem.menu.icon,
      };
      menuItemMapping.set(contextItem.name, item);
      contextItemMapping.set(key, contextItem);
      if (parent && menuItemMapping.has(parent)) {
        const parentMenu = menuItemMapping.get(parent);
        if (!parentMenu.children) {
          parentMenu.children = [];
        }
        parentMenu.children.push(item);
      } else {
        menuItems.push(item);
      }
    });
    const onClick = (e) => {
      const workContextItem = contextItemMapping.get(e.key);
      workContextItem?.menu?.onClick?.({
        ctx,
        contextItems,
        onAdd: (contextItem) =>
          onAdd({
            type: e.key,
            ...contextItem,
          }),
        onRemove: (uid) => {
          onRemove(e.key, uid);
        },
      });
    };
    return [menuItems, onClick];
  }, [ctx, t, workContext, onAdd, onRemove, ignore]);
  return React.createElement(
    Dropdown,
    {
      menu: { items, onClick },
      placement: 'topLeft',
      disabled: disabled,
      overlayStyle: {
        zIndex: 2000,
      },
    },
    React.createElement(Button, {
      type: 'text',
      icon: React.createElement(AppstoreAddOutlined, null),
      disabled: disabled,
    }),
  );
};
//# sourceMappingURL=AddContextButton.js.map
