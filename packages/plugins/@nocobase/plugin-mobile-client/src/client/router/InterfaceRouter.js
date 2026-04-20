/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css, usePlugin } from '@nocobase/client';
import React from 'react';
import { PluginMobileClient } from '../index';
import { InterfaceProvider } from './InterfaceProvider';
export const InterfaceRouter = React.memo(() => {
    const plugin = usePlugin(PluginMobileClient);
    const MobileRouter = plugin.getMobileRouterComponent();
    return (React.createElement(InterfaceProvider, null,
        React.createElement("div", { className: css `
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
        ` },
            React.createElement(MobileRouter, null))));
});
InterfaceRouter.displayName = 'InterfaceRouter';
//# sourceMappingURL=InterfaceRouter.js.map