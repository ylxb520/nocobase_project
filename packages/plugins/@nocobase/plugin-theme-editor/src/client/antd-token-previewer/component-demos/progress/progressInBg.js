/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Progress, theme } from 'antd';
import React from 'react';
const Demo = () => {
    const { token } = theme.useToken();
    return (React.createElement("div", { style: { padding: 24, background: token.colorBgLayout } },
        React.createElement(Progress, { percent: 30 }),
        React.createElement(Progress, { percent: 50, status: "active" }),
        React.createElement(Progress, { percent: 70, status: "exception" }),
        React.createElement(Progress, { percent: 100 }),
        React.createElement(Progress, { percent: 50, showInfo: false }),
        React.createElement(Progress, { steps: 8 })));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorFillSecondary', 'colorText', 'colorBgContainer'],
    key: 'layout',
};
export default componentDemo;
//# sourceMappingURL=progressInBg.js.map