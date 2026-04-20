/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observer, Schema, useField, useFieldSchema } from '@formily/react';
import { Action, FlagProvider, NocoBaseRecursionField, SchemaComponent, useActionContext, useGlobalTheme, useZIndexContext, zIndexContext, } from '@nocobase/client';
import { ConfigProvider } from 'antd';
import { Popup } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMobileActionDrawerStyle } from './ActionDrawer.style';
import { usePopupContainer } from './FilterAction';
import { MIN_Z_INDEX_INCREMENT } from './zIndex';
export const MobilePopup = (props) => {
    const { title, visible, onClose: closePopup, children, minHeight } = props;
    const { t } = useTranslation();
    const { popupContainerRef } = usePopupContainer(visible);
    const { componentCls, hashId } = useMobileActionDrawerStyle();
    const parentZIndex = useZIndexContext();
    const { theme: globalTheme } = useGlobalTheme();
    const newZIndex = parentZIndex + MIN_Z_INDEX_INCREMENT;
    const zIndexStyle = useMemo(() => {
        return {
            zIndex: newZIndex,
            minHeight,
        };
    }, [newZIndex, minHeight]);
    const theme = useMemo(() => {
        return {
            ...globalTheme,
            token: {
                ...globalTheme.token,
                zIndexPopupBase: newZIndex,
                paddingPageHorizontal: 8,
                paddingPageVertical: 8,
                marginBlock: 12,
                borderRadiusBlock: 8,
                fontSize: 14,
            },
        };
    }, [globalTheme, newZIndex]);
    return (React.createElement(zIndexContext.Provider, { value: newZIndex },
        React.createElement(ConfigProvider, { theme: theme },
            React.createElement(Popup, { className: `${componentCls} ${hashId}`, visible: visible, onClose: closePopup, onMaskClick: closePopup, getContainer: () => popupContainerRef.current, bodyClassName: "nb-mobile-action-drawer-body", bodyStyle: zIndexStyle, maskStyle: zIndexStyle, style: zIndexStyle, destroyOnClose: true },
                React.createElement("div", { className: "nb-mobile-action-drawer-header" },
                    React.createElement("span", { className: "nb-mobile-action-drawer-placeholder" },
                        React.createElement(CloseOutline, null)),
                    React.createElement("span", null, title),
                    React.createElement("span", { className: "nb-mobile-action-drawer-close-icon", onClick: closePopup, role: "button", tabIndex: 0, "aria-label": t('Close') },
                        React.createElement(CloseOutline, null))),
                React.createElement(FlagProvider, { isInMobileDrawer: true }, children)))));
};
export const ActionDrawerUsedInMobile = observer((props) => {
    const fieldSchema = useFieldSchema();
    const field = useField();
    const { visible, setVisible } = useActionContext();
    const { visiblePopup } = usePopupContainer(visible);
    // 克隆的目的是为了把底部按钮的 schema 去掉，避免重复渲染。
    // 不使用 filterProperties 的原因是防止 Iphone 中出现卡死的问题，具体原因未知。
    const clonedFieldSchema = useMemo(() => {
        return new Schema(fieldSchema.toJSON());
    }, []); // 不需要依赖 fieldSchema，不然会导致在弹窗中添加区块时不刷新 UI
    // this schema need to add padding in the content area of the popup
    const isSpecialSchema = isChangePasswordSchema(fieldSchema) || isEditProfileSchema(fieldSchema);
    const footerNodeName = isSpecialSchema ? 'Action.Drawer.Footer' : props.footerNodeName;
    const specialStyle = isSpecialSchema ? { backgroundColor: 'white' } : {};
    const footerSchema = useMemo(() => {
        return clonedFieldSchema.reduceProperties((buf, s) => {
            if (s['x-component'] === footerNodeName) {
                s.parent.removeProperty(s.name); // 移除掉底部按钮区域的 schema
                return s;
            }
            return buf;
        });
    }, [clonedFieldSchema, footerNodeName]);
    const title = field.title || '';
    const closePopup = useCallback(() => {
        setVisible(false);
    }, [setVisible]);
    const popupContent = isSpecialSchema ? (React.createElement("div", { style: { padding: 12, ...specialStyle } },
        React.createElement(SchemaComponent, { basePath: field.address, schema: clonedFieldSchema }))) : (React.createElement(SchemaComponent, { basePath: field.address, schema: clonedFieldSchema }));
    const footerContent = footerSchema ? (React.createElement("div", { className: "nb-mobile-action-drawer-footer", style: isSpecialSchema ? specialStyle : null },
        React.createElement(NocoBaseRecursionField, { basePath: field.address, schema: footerSchema }))) : null;
    return (React.createElement(MobilePopup, { title: title, visible: visiblePopup, onClose: closePopup },
        popupContent,
        footerContent));
});
ActionDrawerUsedInMobile.displayName = 'ActionDrawerUsedInMobile';
const originalActionDrawer = Action.Drawer;
/**
 * adapt Action.Drawer to mobile
 */
export const useToAdaptActionDrawerToMobile = () => {
    Action.Drawer = ActionDrawerUsedInMobile;
    Action.Drawer.FootBar = (props) => {
        return React.createElement("div", { style: { display: 'flex', justifyContent: 'end', gap: 8 } }, props.children);
    };
    useEffect(() => {
        return () => {
            Action.Drawer = originalActionDrawer;
        };
    }, []);
};
function isEditProfileSchema(schema) {
    return schema.title === `{{t("Edit profile")}}`;
}
function isChangePasswordSchema(schema) {
    return schema.title === `{{t("Change password")}}`;
}
//# sourceMappingURL=ActionDrawer.js.map