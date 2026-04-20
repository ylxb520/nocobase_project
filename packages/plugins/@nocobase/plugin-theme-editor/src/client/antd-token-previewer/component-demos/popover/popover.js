/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Popover } from 'antd';
import React from 'react';
const content = (React.createElement("div", null,
    React.createElement("p", null, "Content"),
    " ",
    React.createElement("p", null, "Content")));
const Demo = () => (React.createElement("div", null,
    React.createElement(Popover._InternalPanelDoNotUseOrYouWillBeFired, { content: content, title: "Title" }),
    React.createElement(Button, { type: "primary" }, "Hover me")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgElevated'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=popover.js.map