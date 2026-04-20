/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Result } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Result, { status: "success", title: "Successfully Purchased Cloud Server ECS!", subTitle: "Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.", extra: [
        React.createElement(Button, { type: "primary", key: "console" }, "Go Console"),
        React.createElement(Button, { key: "buy" }, "Buy Again"),
    ] }));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSuccess'],
    key: 'result',
};
export default componentDemo;
//# sourceMappingURL=result.js.map