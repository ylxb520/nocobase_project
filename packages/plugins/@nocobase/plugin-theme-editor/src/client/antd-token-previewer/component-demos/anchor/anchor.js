/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Anchor } from 'antd';
import React from 'react';
const { Link } = Anchor;
const Demo = () => {
    return (React.createElement("div", { style: { padding: 12 } },
        React.createElement(Anchor, null,
            React.createElement(Link, { href: "#", title: "Basic demo" }),
            React.createElement(Link, { href: "#components-anchor-demo-static", title: "Static demo" }),
            React.createElement(Link, { href: "#API", title: "API" },
                React.createElement(Link, { href: "#Anchor-Props", title: "Anchor Props" }),
                React.createElement(Link, { href: "#Link-Props", title: "Link Props" })))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorSplit', 'colorBgContainer'],
    key: 'anchor',
};
export default componentDemo;
//# sourceMappingURL=anchor.js.map