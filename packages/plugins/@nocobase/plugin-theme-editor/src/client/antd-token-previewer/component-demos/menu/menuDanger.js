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
const items = [
    {
        key: '0',
        danger: true,
        label: '危险',
    },
    {
        key: '1',
        danger: true,
        label: '危险选中',
    },
    {
        key: '2',
        danger: true,
        disabled: true,
        label: '危险禁用',
    },
];
const Demo = () => {
    const onClick = (e) => {
        console.log('click ', e);
    };
    return React.createElement(Menu, { onClick: onClick, style: { width: 256 }, defaultSelectedKeys: ['1'], items: items });
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'colorErrorHover', 'colorErrorOutline'],
    key: 'danger',
};
export default componentDemo;
//# sourceMappingURL=menuDanger.js.map