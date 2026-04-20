/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Card } from 'antd';
import React from 'react';
const gridStyle = {
    width: '25%',
    textAlign: 'center',
};
const Demo = () => (React.createElement(Card, { title: "Card Title" },
    React.createElement(Card.Grid, { style: gridStyle }, "Content"),
    React.createElement(Card.Grid, { hoverable: false, style: gridStyle }, "Content"),
    React.createElement(Card.Grid, { style: gridStyle }, "Content"),
    React.createElement(Card.Grid, { style: gridStyle }, "Content"),
    React.createElement(Card.Grid, { style: gridStyle }, "Content"),
    React.createElement(Card.Grid, { style: gridStyle }, "Content"),
    React.createElement(Card.Grid, { style: gridStyle }, "Content")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBorderSecondary'],
    key: 'cardGrid',
};
export default componentDemo;
//# sourceMappingURL=cardGrid.js.map