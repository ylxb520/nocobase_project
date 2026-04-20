/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { PinnedPluginListProvider, SchemaComponentOptions } from '@nocobase/client';
import { Inbox } from './components/Inbox';
export const MessageManagerProvider = (props) => {
    return (React.createElement(PinnedPluginListProvider, { items: {
            inbox: { order: 301, component: 'Inbox', pin: true, snippet: '*' },
        } },
        React.createElement(SchemaComponentOptions, { components: { Inbox } }, props.children)));
};
//# sourceMappingURL=MessageManagerProvider.js.map