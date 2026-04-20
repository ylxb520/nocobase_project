/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Checkbox, Space } from 'antd';
import React from 'react';
const Demo = (props) => (React.createElement(Space, null,
    React.createElement(Checkbox, { ...props }, "Checkbox"),
    React.createElement(Checkbox, { ...props, checked: true }, "\u9009\u4E2D\u6001")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorText', 'colorBgContainer'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=checkbox.js.map