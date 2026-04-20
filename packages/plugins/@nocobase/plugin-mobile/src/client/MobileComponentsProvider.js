/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Action, OpenModeProvider, SchemaComponentOptions, useMobileLayout, usePopupSettings } from '@nocobase/client';
import { createGlobalStyle } from 'antd-style';
import React, { useEffect } from 'react';
import { ActionDrawerUsedInMobile, useToAdaptActionDrawerToMobile } from './adaptor-of-desktop/ActionDrawer';
import { useToAdaptFilterActionToMobile } from './adaptor-of-desktop/FilterAction';
import { mobileComponents } from './pages/dynamic-page/MobilePage';
const ResetScrollbar = createGlobalStyle `
  ::-webkit-scrollbar {
    display: none;
  }
`;
const CommonDrawer = (props) => {
    const { isMobileLayout } = useMobileLayout();
    const { isPopupVisibleControlledByURL } = usePopupSettings();
    // 在移动端布局中，只要弹窗是通过 URL 打开的，都需要显示成子页面的样子
    if (isMobileLayout && isPopupVisibleControlledByURL()) {
        return React.createElement(Action.Page, { ...props });
    }
    return React.createElement(ActionDrawerUsedInMobile, { ...props });
};
const openModeToComponent = {
    page: Action.Page,
    drawer: CommonDrawer,
    modal: CommonDrawer,
};
const MobileAdapter = (props) => {
    useToAdaptFilterActionToMobile();
    useToAdaptActionDrawerToMobile();
    useEffect(() => {
        document.body.style.setProperty('--nb-mobile-page-tabs-content-padding', '12px');
        document.body.style.setProperty('--nb-mobile-page-header-height', '46px');
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement(ResetScrollbar, null),
        React.createElement(OpenModeProvider, { defaultOpenMode: "page", isMobile: true, openModeToComponent: openModeToComponent },
            React.createElement(SchemaComponentOptions, { components: mobileComponents }, props.children))));
};
export const MobileComponentsProvider = (props) => {
    const { isMobileLayout } = useMobileLayout();
    if (!isMobileLayout) {
        return React.createElement(React.Fragment, null,
            props.children,
            " ");
    }
    return React.createElement(MobileAdapter, null, props.children);
};
//# sourceMappingURL=MobileComponentsProvider.js.map