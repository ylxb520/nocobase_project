/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField, useFieldSchema } from '@formily/react';
import { BackButtonUsedInSubPage, NocoBaseRecursionField, SchemaComponent, TabsContextProvider, useActionContext, useTabsContext, useZIndexContext, zIndexContext, } from '@nocobase/client';
import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MIN_Z_INDEX_INCREMENT } from '../zIndex';
import { useMobileActionPageStyle } from './MobileActionPage.style';
import { MobileTabsForMobileActionPage } from './MobileTabsForMobileActionPage';
const components = { Tabs: MobileTabsForMobileActionPage };
/**
 * 在移动端通过 Action 按钮打开的页面
 * @returns
 */
export const MobileActionPage = ({ level, footerNodeName }) => {
    const field = useField();
    const fieldSchema = useFieldSchema();
    const ctx = useActionContext();
    const { componentCls, hashId } = useMobileActionPageStyle();
    const tabContext = useTabsContext();
    const containerDOM = useMemo(() => document.querySelector('.nb-mobile-subpages-slot'), []);
    const parentZIndex = useZIndexContext();
    // in nested popups, basicZIndex is an accumulated value to ensure that
    // the z-index of the current level is always higher than the previous level
    const newZIndex = parentZIndex + MIN_Z_INDEX_INCREMENT + (level || 1);
    const footerSchema = fieldSchema.reduceProperties((buf, s) => {
        if (s['x-component'] === footerNodeName) {
            return s;
        }
        return buf;
    });
    const zIndexStyle = useMemo(() => {
        return {
            zIndex: newZIndex,
        };
    }, [newZIndex]);
    if (!ctx.visible) {
        return null;
    }
    const actionPageNode = (React.createElement(zIndexContext.Provider, { value: newZIndex },
        React.createElement("div", { className: `${componentCls} ${hashId}`, style: zIndexStyle },
            React.createElement(TabsContextProvider, { ...tabContext, tabBarExtraContent: React.createElement(BackButtonUsedInSubPage, null), tabBarGutter: 48 },
                React.createElement(SchemaComponent, { components: components, schema: fieldSchema, onlyRenderProperties: true })),
            footerSchema && (React.createElement("div", { className: "nb-mobile-action-page-footer", style: zIndexStyle },
                React.createElement(NocoBaseRecursionField, { basePath: field.address, schema: fieldSchema, onlyRenderProperties: true, filterProperties: (s) => {
                        return s['x-component'] === footerNodeName;
                    } }))))));
    if (containerDOM) {
        return createPortal(actionPageNode, containerDOM);
    }
    return actionPageNode;
};
//# sourceMappingURL=MobileActionPage.js.map