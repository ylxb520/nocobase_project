/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Divider, Space, Tag, theme } from 'antd';
import React from 'react';
const Demo = () => {
    const { token } = theme.useToken();
    return (React.createElement(Space, { direction: 'vertical' },
        React.createElement("div", { style: { padding: 12 } },
            React.createElement(Tag, { color: "magenta" }, "magenta"),
            React.createElement(Tag, { color: "red" }, "red"),
            React.createElement(Tag, { color: "volcano" }, "volcano"),
            React.createElement(Tag, { color: "orange" }, "orange"),
            React.createElement(Tag, { color: "gold" }, "gold"),
            React.createElement(Tag, { color: "lime" }, "lime"),
            React.createElement(Tag, { color: "green" }, "green"),
            React.createElement(Tag, { color: "cyan" }, "cyan"),
            React.createElement(Tag, { color: "blue" }, "blue"),
            React.createElement(Tag, { color: "geekblue" }, "geekblue"),
            React.createElement(Tag, { color: "purple" }, "purple")),
        React.createElement(Divider, null),
        React.createElement("div", { style: { background: token.colorFillSecondary, padding: 12 } },
            React.createElement(Tag, { color: "magenta" }, "magenta"),
            React.createElement(Tag, { color: "red" }, "red"),
            React.createElement(Tag, { color: "volcano" }, "volcano"),
            React.createElement(Tag, { color: "orange" }, "orange"),
            React.createElement(Tag, { color: "gold" }, "gold"),
            React.createElement(Tag, { color: "lime" }, "lime"),
            React.createElement(Tag, { color: "green" }, "green"),
            React.createElement(Tag, { color: "cyan" }, "cyan"),
            React.createElement(Tag, { color: "blue" }, "blue"),
            React.createElement(Tag, { color: "geekblue" }, "geekblue"),
            React.createElement(Tag, { color: "purple" }, "purple"))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: [
        'blue-1',
        'blue-3',
        'blue-6',
        'blue-7',
        'cyan-1',
        'cyan-3',
        'cyan-6',
        'cyan-7',
        'geekblue-1',
        'geekblue-3',
        'geekblue-6',
        'geekblue-7',
        'gold-1',
        'gold-3',
        'gold-6',
        'gold-7',
        'green-1',
        'green-3',
        'green-6',
        'green-7',
        'lime-1',
        'lime-3',
        'lime-6',
        'lime-7',
        'magenta-1',
        'magenta-3',
        'magenta-6',
        'magenta-7',
        'orange-1',
        'orange-3',
        'orange-6',
        'orange-7',
        'pink-1',
        'pink-3',
        'pink-6',
        'pink-7',
        'purple-1',
        'purple-3',
        'purple-6',
        'purple-7',
        'volcano-1',
        'volcano-3',
        'volcano-6',
        'volcano-7',
        'yellow-1',
        'yellow-3',
        'yellow-6',
        'yellow-7',
        'red-1',
        'red-3',
        'red-6',
        'red-7',
    ],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=tag.js.map