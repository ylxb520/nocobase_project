/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Col, Row, Statistic } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Row, { gutter: 16 },
    React.createElement(Col, { span: 12 },
        React.createElement(Statistic, { title: "Active Users", value: 112893 })),
    React.createElement(Col, { span: 12 },
        React.createElement(Statistic, { title: "Account Balance (CNY)", value: 112893, precision: 2 }),
        React.createElement(Button, { style: { marginTop: 16 }, type: "primary" }, "Recharge")),
    React.createElement(Col, { span: 12 },
        React.createElement(Statistic, { title: "Active Users", value: 112893, loading: true }))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=statistic.js.map