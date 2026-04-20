/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { InputNumber } from 'antd';
import React from 'react';
const Demo = () => React.createElement(InputNumber, { min: 1, max: 10, defaultValue: 3, disabled: true });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgContainerDisabled'],
    key: 'disabled',
};
export default componentDemo;
//# sourceMappingURL=disabled.js.map