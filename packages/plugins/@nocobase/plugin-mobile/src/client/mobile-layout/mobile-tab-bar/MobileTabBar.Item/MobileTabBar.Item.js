/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Icon, useCompile } from '@nocobase/client';
import { Badge } from 'antd-mobile';
import classnames from 'classnames';
import React from 'react';
import { useRouteTranslation } from '../../../locale';
function getIcon(item, selected) {
    const { icon, selectedIcon } = item;
    const res = selected && selectedIcon ? selectedIcon : icon;
    if (!res)
        return undefined;
    if (typeof res === 'string')
        return React.createElement(Icon, { type: res });
    return icon;
}
export const MobileTabBarItem = (props) => {
    const { title, onClick, selected, badge } = props;
    const icon = getIcon(props, selected);
    const { t } = useRouteTranslation();
    const compile = useCompile();
    return (React.createElement("div", { onClick: onClick, "data-testid": `mobile-tab-bar-${title}`, className: classnames('adm-tab-bar-item', {
            ['adm-tab-bar-item-active']: selected,
        }), style: { lineHeight: 1 } },
        React.createElement(Badge, { content: badge, style: { '--top': '5px' } },
            React.createElement("span", { className: 'adm-tab-bar-item-icon' }, icon)),
        React.createElement("span", { className: classnames('adm-tab-bar-item-title', {
                ['adm-tab-bar-item-title-with-icon']: icon,
            }), style: { fontSize: '12px' } }, t(compile(title)))));
};
//# sourceMappingURL=MobileTabBar.Item.js.map