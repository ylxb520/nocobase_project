/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
const Demo = () => {
    const onFinish = () => { };
    const onFinishFailed = () => { };
    return (React.createElement(Form, { name: "basic", labelCol: { span: 8 }, wrapperCol: { span: 16 }, initialValues: { remember: true }, onFinish: onFinish, onFinishFailed: onFinishFailed, autoComplete: "off" },
        React.createElement(Form.Item, { label: "Username", name: "username", rules: [{ required: true, message: 'Please input your username!' }] },
            React.createElement(Input, null)),
        React.createElement(Form.Item, { label: "Password", name: "password", rules: [{ required: true, message: 'Please input your password!' }] },
            React.createElement(Input.Password, null)),
        React.createElement(Form.Item, { name: "remember", valuePropName: "checked", wrapperCol: { offset: 8, span: 16 } },
            React.createElement(Checkbox, null, "Remember me")),
        React.createElement(Form.Item, { wrapperCol: { offset: 8, span: 16 } },
            React.createElement(Button, { type: "primary", htmlType: "submit" }, "Submit"))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'controlOutline', 'colorErrorBorder', 'colorErrorHover'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=form.js.map