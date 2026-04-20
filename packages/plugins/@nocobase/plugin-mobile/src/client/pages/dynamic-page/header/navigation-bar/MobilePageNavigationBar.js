/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useFieldSchema } from '@formily/react';
import { cx, NocoBaseRecursionField, SchemaToolbarProvider } from '@nocobase/client';
import { NavBar } from 'antd-mobile';
import React from 'react';
import { useRouteTranslation } from '../../../../locale';
import { useMobileTitle } from '../../../../mobile-providers';
import { useMobilePage } from '../../context';
import { useStyles } from './styles';
export const MobilePageNavigationBar = () => {
    const { title } = useMobileTitle() || {};
    const { displayNavigationBar = true, displayPageTitle = true } = useMobilePage();
    const fieldSchema = useFieldSchema();
    const { componentCls, hashId } = useStyles();
    const { t } = useRouteTranslation();
    if (!displayNavigationBar)
        return null;
    return (React.createElement("div", { className: cx('mobile-page-navigation-bar', componentCls, hashId), "data-testid": "mobile-page-navigation-bar" },
        React.createElement(NavBar, { backArrow: false, back: null, left: React.createElement(SchemaToolbarProvider, { position: "left" },
                React.createElement(NocoBaseRecursionField, { name: "actionBarLeft", schema: fieldSchema, onlyRenderProperties: true })), right: React.createElement(SchemaToolbarProvider, { position: "right" },
                React.createElement(NocoBaseRecursionField, { name: "actionBarRight", schema: fieldSchema, onlyRenderProperties: true })) }, displayPageTitle ? t(title) : null),
        React.createElement(SchemaToolbarProvider, { position: "bottom" },
            React.createElement(NocoBaseRecursionField, { name: "actionBarBottom", schema: fieldSchema, onlyRenderProperties: true }))));
};
//# sourceMappingURL=MobilePageNavigationBar.js.map