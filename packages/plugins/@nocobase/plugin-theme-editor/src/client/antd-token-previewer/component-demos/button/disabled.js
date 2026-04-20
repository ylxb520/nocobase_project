/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, null,
    React.createElement(Button, { disabled: true, type: "primary" }, "Primary"),
    React.createElement(Button, { disabled: true }, "Default"),
    React.createElement(Button, { disabled: true, type: "dashed" }, "Dashed"),
    React.createElement("br", null),
    React.createElement(Button, { disabled: true, type: "text" }, "Text"),
    React.createElement(Button, { disabled: true, ghost: true }, "Ghost"),
    React.createElement(Button, { disabled: true, type: "link" }, "Link")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorTextDisabled', 'colorBgContainerDisabled'],
    key: 'disabled',
};
export default componentDemo;
//# sourceMappingURL=disabled.js.map