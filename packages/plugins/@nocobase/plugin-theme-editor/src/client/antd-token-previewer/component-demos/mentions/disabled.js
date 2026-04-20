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
const Demo = () => (React.createElement(Mentions, { style: { width: '100%' }, status: 'error', disabled: true, defaultValue: "@afc163" },
    React.createElement(Option, { value: "afc163" }, "afc163"),
    React.createElement(Option, { value: "zombieJ" }, "zombieJ"),
    React.createElement(Option, { value: "yesmeck" }, "yesmeck")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgContainerDisabled', 'colorTextDisabled'],
    key: 'disabled',
};
export default componentDemo;
//# sourceMappingURL=disabled.js.map