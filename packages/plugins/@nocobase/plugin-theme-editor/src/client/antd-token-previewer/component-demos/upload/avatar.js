/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React from 'react';
const Demo = () => (React.createElement("div", null,
    React.createElement(Upload, { name: "avatar", listType: "picture-card", className: "avatar-uploader", showUploadList: false, action: "https://www.mocky.io/v2/5cc8019d300000980a055e76" },
        React.createElement("div", null,
            React.createElement(PlusOutlined, null),
            React.createElement("div", { style: { marginTop: 8 } }, "Upload")))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorFillAlter'],
    key: 'avatar',
};
export default componentDemo;
//# sourceMappingURL=avatar.js.map