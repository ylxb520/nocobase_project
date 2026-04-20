/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Divider } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(React.Fragment, null,
    React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo."),
    React.createElement(Divider, { plain: true }, "Text"),
    React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo."),
    React.createElement(Divider, { orientation: "left", plain: true }, "Left Text"),
    React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo."),
    React.createElement(Divider, { orientation: "right", plain: true }, "Right Text"),
    React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSplit', 'colorText'],
    key: 'divider',
};
export default componentDemo;
//# sourceMappingURL=divider.js.map