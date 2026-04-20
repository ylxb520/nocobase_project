/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Radio, Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, null,
    React.createElement(Radio.Group, { defaultValue: 'a', buttonStyle: "solid" },
        React.createElement(Radio.Button, { value: 'a', checked: true }, "Hangzhou"),
        React.createElement(Radio.Button, { value: 'b' }, "Shanghai")),
    React.createElement("div", null,
        React.createElement(Radio.Button, null, "Apple"),
        React.createElement(Radio.Button, { checked: true }, "Orange"))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimaryActive', 'colorPrimaryHover'],
    key: 'button',
};
export default componentDemo;
//# sourceMappingURL=button.js.map