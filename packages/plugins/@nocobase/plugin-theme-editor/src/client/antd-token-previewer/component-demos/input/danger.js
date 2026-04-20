/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Input } from 'antd';
import React from 'react';
function onChange() { }
const Demo = () => React.createElement(Input, { status: 'error', defaultValue: 'hello', onChange: onChange });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'colorErrorOutline', 'colorErrorBorder', 'colorErrorHover'],
    key: 'danger',
};
export default componentDemo;
//# sourceMappingURL=danger.js.map