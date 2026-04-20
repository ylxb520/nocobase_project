/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
const Demo = () => {
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { type: "primary", onClick: showDrawer }, "Open"),
        React.createElement(Drawer, { title: "Basic Drawer", placement: "right", onClose: onClose, open: visible },
            React.createElement("p", null, "Some contents..."),
            React.createElement("p", null, "Some contents..."),
            React.createElement("p", null, "Some contents..."))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgMask', 'colorBgElevated'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=drawer.js.map