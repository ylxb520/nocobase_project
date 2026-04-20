/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Typography } from 'antd';
import React from 'react';
const { Title, Paragraph, Text, Link } = Typography;
const Demo = () => (React.createElement(Typography, null,
    React.createElement(Title, { level: 4 }, "\u300A\u6545\u4E61\u300B "),
    React.createElement(Paragraph, null, "\u2014\u2014\u9C81\u8FC5"),
    React.createElement(Paragraph, null,
        React.createElement(Text, { strong: true }, "\u6DF1\u84DD\u7684\u5929\u7A7A\u4E2D\u6302\u7740\u4E00\u8F6E\u91D1\u9EC4\u7684\u5706\u6708"),
        "\uFF0C\u4E0B\u9762\u662F\u6D77\u8FB9\u7684\u6C99\u5730\uFF0C\u90FD\u79CD\u7740\u4E00\u671B\u65E0\u9645\u7684\u78A7\u7EFF\u7684\u897F\u74DC\uFF0C\u5176\u95F4\u6709\u4E00\u4E2A\u5341\u4E00\u4E8C\u5C81\u7684\u5C11\u5E74\uFF0C\u9879\u5E26\u94F6\u5708\uFF0C\u624B\u634F\u4E00\u67C4\u94A2\u53C9\uFF0C",
        React.createElement(Text, { mark: true }, "\u5411\u4E00\u5339\u7339\u5C3D\u529B\u7684\u523A\u53BB"),
        "\uFF0C\u90A3\u7339\u5374\u5C06\u8EAB\u4E00\u626D\uFF0C\u53CD\u4ECE\u4ED6\u7684\u80EF\u4E0B\u9003\u8D70\u4E86\u3002"),
    React.createElement(Paragraph, null,
        React.createElement("ul", null,
            React.createElement("li", null,
                React.createElement(Link, { href: "#" }, "\u72C2\u4EBA\u65E5\u8BB0")),
            React.createElement("li", null,
                React.createElement(Link, { href: "#" }, "\u5450\u558A")),
            React.createElement("li", null,
                React.createElement(Link, { href: "#" }, "\u5F77\u5FA8"))))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSuccess'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=typography.js.map