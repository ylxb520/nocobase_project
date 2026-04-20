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
    React.createElement(Button, { type: "primary" }, "Primary Button"),
    React.createElement(Button, null, "Default Button"),
    React.createElement(Button, { type: "dashed" }, "Dashed Button"),
    " ",
    React.createElement("br", null),
    React.createElement(Button, { type: "text" }, "Text Button"),
    React.createElement(Button, { ghost: true }, "Ghost Button"),
    React.createElement(Button, { type: "link" }, "Link Button")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: [
        'colorText',
        'colorPrimary',
        'colorPrimaryActive',
        'colorPrimaryHover',
        'controlOutline',
        'controlTmpOutline',
    ],
    key: 'button',
};
export default componentDemo;
//# sourceMappingURL=button.js.map