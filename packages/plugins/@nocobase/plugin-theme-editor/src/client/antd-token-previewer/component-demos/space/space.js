/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Upload } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, null,
    "Space",
    React.createElement(Button, { type: "primary" }, "Button"),
    React.createElement(Upload, null,
        React.createElement(Button, null,
            React.createElement(UploadOutlined, null),
            " Click to Upload")),
    React.createElement(Popconfirm, { title: "Are you sure delete this task?", okText: "Yes", cancelText: "No" },
        React.createElement(Button, null, "Confirm"))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=space.js.map