/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Descriptions } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Descriptions, { title: "User Info", bordered: true },
    React.createElement(Descriptions.Item, { label: "Product" }, "Cloud Database"),
    React.createElement(Descriptions.Item, { label: "Billing Mode" }, "Prepaid"),
    React.createElement(Descriptions.Item, { label: "Automatic Renewal" }, "YES"),
    React.createElement(Descriptions.Item, { label: "Order time" }, "2018-04-24 18:00:00")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSplit', 'colorText', 'colorFillAlter'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=descriptions.js.map