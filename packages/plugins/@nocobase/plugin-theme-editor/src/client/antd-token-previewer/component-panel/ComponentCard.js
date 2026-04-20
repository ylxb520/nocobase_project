/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Card } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { Control } from '../icons';
import makeStyle from '../utils/makeStyle';
import ComponentTokenDrawer from './ComponentTokenDrawer';
const useStyle = makeStyle('ComponentCard', (token) => ({
    [`${token.rootCls}-card.component-card`]: {
        borderRadius: 6,
        boxShadow: `0 1px 2px 0 rgba(25,15,15,0.07)`,
        [`${token.rootCls}-card-head`]: {
            paddingInline: 18,
            [`${token.rootCls}-card-head-title`]: {
                paddingBlock: token.paddingSM,
                fontSize: token.fontSize,
            },
        },
        [`${token.rootCls}-card-body`]: {
            padding: 18,
            overflow: 'auto',
        },
        '.component-token-control-icon': {
            color: token.colorIcon,
            transition: `color ${token.motionDurationMid}`,
            fontSize: token.fontSizeLG,
            cursor: 'pointer',
            '&:hover': {
                color: token.colorIconHover,
            },
        },
    },
}));
export const getComponentDemoId = (component) => `antd-token-previewer-${component}`;
const ComponentCard = ({ children, component, title, theme, drawer }) => {
    const [wrapSSR, hashId] = useStyle();
    const [drawerOpen, setDrawerOpen] = useState(false);
    return wrapSSR(React.createElement(React.Fragment, null,
        React.createElement(Card, { className: classNames('component-card', hashId), title: title, extra: drawer && theme && React.createElement(Control, { className: "component-token-control-icon", onClick: () => setDrawerOpen(true) }) }, children),
        drawer && theme && (React.createElement(ComponentTokenDrawer, { visible: drawerOpen, theme: theme, component: component, onClose: () => setDrawerOpen(false) }))));
};
export default ComponentCard;
//# sourceMappingURL=ComponentCard.js.map