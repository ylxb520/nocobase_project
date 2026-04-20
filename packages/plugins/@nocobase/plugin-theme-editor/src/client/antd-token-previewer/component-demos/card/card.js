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
    React.createElement(Card, { title: "Default size card", extra: React.createElement("a", { href: "#" }, "More"), style: { width: 300 } },
        React.createElement("p", null, "Card content"),
        " ",
        React.createElement("p", null, "Card content"),
        " ",
        React.createElement("p", null, "Card content")),
    React.createElement(Card, { loading: true, size: "small", title: "Small size card", extra: React.createElement("a", { href: "#" }, "More"), style: { width: 300 } },
        React.createElement("p", null, "Card content"),
        " ",
        React.createElement("p", null, "Card content"),
        " ",
        React.createElement("p", null, "Card content"))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: [
        'colorText',
        'colorTextHeading',
        'colorTextSecondary',
        'colorBgContainer',
        'colorBorderSecondary',
        'colorPrimary',
        'colorBgContainer',
    ],
    key: 'card',
};
export default componentDemo;
//# sourceMappingURL=card.js.map