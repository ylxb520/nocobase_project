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
const Demo = () => React.createElement(Input, { placeholder: "Basic usage", value: '右侧的图标就是 colorIcon', allowClear: true });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorIcon', 'colorIconHover'],
    key: 'clearIcon',
};
export default componentDemo;
//# sourceMappingURL=clearIcon.js.map