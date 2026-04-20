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
const Demo = () => React.createElement(Input, { addonBefore: "http://", addonAfter: ".com", defaultValue: "mysite" });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorFillAlter'],
    key: 'withAddon',
};
export default componentDemo;
//# sourceMappingURL=withAddon.js.map