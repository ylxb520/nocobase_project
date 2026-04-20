/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Form, Input } from 'antd';
import React from 'react';
function onFinish() { }
const Demo = () => (React.createElement(Form, { name: "basic", labelCol: { span: 8 }, wrapperCol: { span: 16 }, initialValues: { remember: true }, onFinish: onFinish, autoComplete: "off" },
    React.createElement(Form.Item, { label: "Username", name: "username", status: 'warning', rules: [{ required: true, message: 'Please input your username!' }] },
        React.createElement(Input, null))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorWarning'],
    key: 'warning',
};
export default componentDemo;
//# sourceMappingURL=warning.js.map