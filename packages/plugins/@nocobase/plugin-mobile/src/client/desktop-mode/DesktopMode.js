/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Layout } from 'antd';
import React from 'react';
import { isDesktop } from 'react-device-detect';
import { useUIConfigurationPermissions } from '@nocobase/client';
import { PageBackgroundColor } from '../constants';
import { DesktopModeContent } from './Content';
import { DesktopModeHeader } from './Header';
import { SizeContextProvider } from './sizeContext';
export const DesktopMode = ({ children }) => {
    const { allowConfigUI } = useUIConfigurationPermissions();
    if (!isDesktop || !allowConfigUI) {
        return React.createElement(React.Fragment, null, children);
    }
    return (React.createElement(SizeContextProvider, null,
        React.createElement(Layout, { style: { height: '100%', background: PageBackgroundColor } },
            React.createElement(Layout.Header, { style: { height: 46 } },
                React.createElement(DesktopModeHeader, null)),
            React.createElement(Layout.Content, null,
                React.createElement(DesktopModeContent, null, children)))));
};
//# sourceMappingURL=DesktopMode.js.map