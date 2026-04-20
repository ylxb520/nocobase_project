/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Radio } from 'antd';
import React from 'react';
const Demo = () => React.createElement(Radio, { checked: true }, "Radio");
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'controlOutline', 'colorBgContainer'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=radio.js.map