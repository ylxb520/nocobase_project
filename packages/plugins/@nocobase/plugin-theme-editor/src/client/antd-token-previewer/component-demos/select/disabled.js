/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import Select from './_internal';
import React from 'react';
import options from './data';
const Demo = () => (React.createElement(Select, { mode: "multiple", allowClear: true, style: {
        width: '100%',
    }, disabled: true, options: options, placeholder: "Please select", defaultValue: ['a10', 'c12'] }));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgContainerDisabled', 'colorTextDisabled'],
    key: 'disabled',
};
export default componentDemo;
//# sourceMappingURL=disabled.js.map