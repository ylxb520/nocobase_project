/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PinnedPluginListProvider, SchemaComponentOptions } from '@nocobase/client';
import React from 'react';
import { AsyncTasks } from './components/AsyncTasks';
export const AsyncTaskManagerProvider = (props) => {
  return React.createElement(
    PinnedPluginListProvider,
    {
      items: {
        asyncTasks: { order: 300, component: 'AsyncTasks', pin: true, snippet: '*' },
      },
    },
    React.createElement(SchemaComponentOptions, { components: { AsyncTasks } }, props.children),
  );
};
//# sourceMappingURL=AsyncTaskManagerProvider.js.map
