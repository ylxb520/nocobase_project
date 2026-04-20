/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { cx, Icon, useSchemaToolbar } from '@nocobase/client';
import { Button, Space } from 'antd-mobile';
import React, { useMemo } from 'react';
import { useStyles } from './styles';
export const MobileNavigationBarAction = React.forwardRef((props, ref) => {
    const { icon, color, fill, children, style = {}, className, onClick } = props;
    const { position } = useSchemaToolbar();
    const title = children[0];
    const designer = children[1];
    const contentLength = [icon, title].filter(Boolean).length;
    const iconElement = useMemo(() => (typeof icon === 'string' ? React.createElement(Icon, { type: icon }) : icon), [icon]);
    const { componentCls, hashId } = useStyles();
    return (React.createElement("div", { ref: ref, className: cx(componentCls, hashId) },
        React.createElement(Button, { onClick: onClick, color: color, size: contentLength <= 1 ? undefined : 'mini', className: cx(className, 'nb-navigation-bar-action', {
                'nb-navigation-bar-action-icon-and-title': contentLength > 1,
                'nb-navigation-bar-action-title': contentLength === 1 && title,
                'nb-navigation-bar-action-icon': contentLength === 1 && icon,
            }), style: style, fill: contentLength <= 1 ? 'none' : fill },
            designer,
            contentLength > 1 ? (position === 'left' ? (React.createElement(Space, { style: { '--gap': '6px' } },
                iconElement,
                React.createElement("span", null, title))) : (React.createElement(Space, { style: { '--gap': '6px' } },
                React.createElement("span", null, title),
                iconElement))) : (React.createElement(Space, null, iconElement || title)))));
});
MobileNavigationBarAction.displayName = 'MobileNavigationBarAction';
//# sourceMappingURL=MobileNavigationBarAction.js.map