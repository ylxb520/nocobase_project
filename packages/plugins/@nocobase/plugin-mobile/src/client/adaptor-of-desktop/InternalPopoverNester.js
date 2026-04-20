/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField } from '@formily/react';
import { useZIndexContext, zIndexContext } from '@nocobase/client';
import { ConfigProvider } from 'antd';
import { Popup } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import React, { useCallback, useMemo } from 'react';
import { usePopupContainer } from './FilterAction';
import { useInternalPopoverNesterUsedInMobileStyle } from './InternalPopoverNester.style';
import { MIN_Z_INDEX_INCREMENT } from './zIndex';
const Container = (props) => {
    const { onOpenChange } = props;
    const { visiblePopup, popupContainerRef } = usePopupContainer(props.open);
    const { componentCls, hashId } = useInternalPopoverNesterUsedInMobileStyle();
    const field = useField();
    const parentZIndex = useZIndexContext();
    const newZIndex = parentZIndex + MIN_Z_INDEX_INCREMENT;
    const title = field.title || '';
    const zIndexStyle = useMemo(() => {
        return {
            zIndex: newZIndex,
        };
    }, [newZIndex]);
    const closePopup = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);
    const openPopup = useCallback(() => {
        onOpenChange(true);
    }, [onOpenChange]);
    const theme = useMemo(() => {
        return {
            token: {
                zIndexPopupBase: newZIndex,
            },
        };
    }, [newZIndex]);
    return (React.createElement(zIndexContext.Provider, { value: newZIndex },
        React.createElement(ConfigProvider, { theme: theme },
            React.createElement("div", { onClick: openPopup }, props.children),
            React.createElement(Popup, { className: `${componentCls} ${hashId}`, visible: visiblePopup, onClose: closePopup, onMaskClick: closePopup, getContainer: () => popupContainerRef.current, bodyClassName: "nb-internal-popover-nester-used-in-mobile-body", bodyStyle: zIndexStyle, maskStyle: zIndexStyle, showCloseButton: true, closeOnSwipe: true },
                React.createElement("div", { className: "nb-internal-popover-nester-used-in-mobile-header" },
                    React.createElement("span", { className: "nb-internal-popover-nester-used-in-mobile-placeholder" },
                        React.createElement(CloseOutline, null)),
                    React.createElement("span", null, title),
                    React.createElement("span", { className: "nb-internal-popover-nester-used-in-mobile-close-icon", onClick: closePopup },
                        React.createElement(CloseOutline, null))),
                props.content,
                React.createElement("div", { style: { height: 50 } })))));
};
export const InternalPopoverNesterUsedInMobile = (props) => {
    const { OriginComponent } = props;
    return React.createElement(OriginComponent, { ...props, Container: Container });
};
//# sourceMappingURL=InternalPopoverNester.js.map