/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ClockCircleFilled } from '@ant-design/icons';
import { Avatar, Badge, Space, theme } from 'antd';
import React from 'react';
const Demo = () => {
    const { token } = theme.useToken();
    return (React.createElement(Space, { size: "large" },
        React.createElement(Badge, { count: 5 },
            React.createElement(Avatar, { shape: "square", size: "large" })),
        React.createElement(Badge, { count: 0, showZero: true },
            React.createElement(Avatar, { shape: "square", size: "large" })),
        React.createElement(Badge, { count: React.createElement(ClockCircleFilled, { style: { color: token.colorError } }) },
            React.createElement(Avatar, { shape: "square", size: "large" }))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'colorBorderBg', 'colorBgContainer'],
    key: 'badge',
};
export default componentDemo;
//# sourceMappingURL=badge.js.map