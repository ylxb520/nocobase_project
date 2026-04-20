/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Tag } from 'antd';
import React from 'react';
const Demo = () => React.createElement(Tag, { color: "warning" }, "Warning");
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorWarning', 'colorWarningBg', 'colorWarningBorder'],
    key: 'warning',
};
export default componentDemo;
//# sourceMappingURL=warning.js.map