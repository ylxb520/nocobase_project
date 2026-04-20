/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SearchOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, null,
    React.createElement(Button, { type: "primary" }, "Primary Button"),
    React.createElement(Tooltip, { title: "search" },
        React.createElement(Button, { type: "primary", shape: "circle", icon: React.createElement(SearchOutlined, null) })),
    React.createElement(Button, { type: "primary", shape: "circle" }, "A"),
    React.createElement(Button, { type: "primary", ghost: true, icon: React.createElement(SearchOutlined, null) }, "Search")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary'],
    key: 'button-icon',
};
export default componentDemo;
//# sourceMappingURL=button-icon.js.map