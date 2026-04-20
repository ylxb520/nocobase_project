/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, null,
    React.createElement(Button, { type: "primary", danger: true }, "primary"),
    React.createElement(Button, { type: "default", danger: true }, "default"),
    React.createElement(Button, { type: "text", danger: true }, "text"),
    React.createElement(Button, { type: "link", danger: true }, "link")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'colorErrorActive', 'colorErrorHover', 'colorErrorBorder', 'colorErrorOutline'],
    key: 'danger',
};
export default componentDemo;
//# sourceMappingURL=dangerButton.js.map