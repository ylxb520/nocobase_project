/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Menu, theme } from 'antd';
import React from 'react';
import items from './data';
const Demo = () => {
    const { token } = theme.useToken();
    return (React.createElement("div", { style: { background: token.colorBorderSecondary, padding: 12 } },
        React.createElement(Menu, { style: { width: 256 }, defaultSelectedKeys: ['1'], defaultOpenKeys: ['sub1'], mode: "inline", items: items })));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSplit'],
    key: 'menuInLayout',
};
export default componentDemo;
//# sourceMappingURL=menuInLayout.js.map