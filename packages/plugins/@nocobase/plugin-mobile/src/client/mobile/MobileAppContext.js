/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { usePlugin } from '@nocobase/client';
import React, { createContext } from 'react';
import { css } from '@emotion/css';
import { PluginMobileClient } from '../index';
export const MobileAppContext = createContext(undefined);
MobileAppContext.displayName = 'MobileAppContext';
export const MobileAppProvider = ({ children }) => {
    const mobilePlugin = usePlugin(PluginMobileClient);
    const [showTabBar, _setShowTabBar] = React.useState(mobilePlugin.getPluginOptions()?.showTabBar ?? true);
    const setShowTabBar = (showTabBar) => {
        _setShowTabBar(showTabBar);
        mobilePlugin.updateOptions({ showTabBar });
    };
    const [showBackButton, _setShowBackButton] = React.useState(mobilePlugin.getPluginOptions()?.showBackButton ?? true);
    const setShowBackButton = (showBackButton) => {
        _setShowBackButton(showBackButton);
        mobilePlugin.updateOptions({ showBackButton });
    };
    return (React.createElement(MobileAppContext.Provider, { value: { showTabBar, setShowTabBar, showBackButton, setShowBackButton } },
        React.createElement("span", { className: css `
          .nb-message-back-action .adm-nav-bar-left {
            visibility: ${showBackButton ? 'visible' : 'hidden'};
          }
        ` }, children)));
};
export const useMobileApp = () => {
    return React.useContext(MobileAppContext);
};
//# sourceMappingURL=MobileAppContext.js.map