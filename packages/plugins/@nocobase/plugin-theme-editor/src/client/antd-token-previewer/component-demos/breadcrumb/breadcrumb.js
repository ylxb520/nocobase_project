/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Breadcrumb } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Breadcrumb, null,
    React.createElement(Breadcrumb.Item, null, "Home"),
    React.createElement(Breadcrumb.Item, null,
        React.createElement("a", { href: "" }, "Application Center")),
    React.createElement(Breadcrumb.Item, null,
        React.createElement("a", { href: "" }, "Application List")),
    React.createElement(Breadcrumb.Item, null, "An Application")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorText', 'colorPrimary', 'colorPrimaryActive', 'colorPrimaryHover'],
    key: 'breadcrumb',
};
export default componentDemo;
//# sourceMappingURL=breadcrumb.js.map