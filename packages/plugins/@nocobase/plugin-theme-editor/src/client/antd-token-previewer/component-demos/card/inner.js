/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Card, Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, null,
    React.createElement(Card, { type: "inner", title: "Inner Card title" }, "Inner Card content")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorFillAlter'],
    key: 'inner',
};
export default componentDemo;
//# sourceMappingURL=inner.js.map