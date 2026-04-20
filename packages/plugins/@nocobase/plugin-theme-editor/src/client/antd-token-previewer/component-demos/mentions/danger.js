/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Mentions } from 'antd';
import React from 'react';
const { Option } = Mentions;
function onChange() { }
function onSelect() { }
const Demo = () => (React.createElement(Mentions, { style: { width: '100%' }, onChange: onChange, onSelect: onSelect, status: 'error', defaultValue: "@afc163" },
    React.createElement(Option, { value: "afc163" }, "afc163"),
    React.createElement(Option, { value: "zombieJ" }, "zombieJ"),
    React.createElement(Option, { value: "yesmeck" }, "yesmeck")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'colorErrorOutline', 'colorErrorBorder', 'colorErrorHover'],
    key: 'danger',
};
export default componentDemo;
//# sourceMappingURL=danger.js.map