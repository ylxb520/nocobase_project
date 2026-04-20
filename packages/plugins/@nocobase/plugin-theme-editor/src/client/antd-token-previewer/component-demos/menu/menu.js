/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Menu } from 'antd';
import React from 'react';
import items from './data';
const Demo = () => {
    const onClick = (e) => {
        console.log('click ', e);
    };
    return (React.createElement("div", null,
        React.createElement(Menu, { onClick: onClick, style: { width: 256 }, defaultSelectedKeys: ['1'], defaultOpenKeys: ['sub1', 'sub2'], mode: "inline", items: items })));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorBgContainer', 'colorFillAlter', 'colorSplit', 'colorPrimaryHover'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=menu.js.map