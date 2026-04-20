/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import React from 'react';
const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: { authorization: 'authorization-text' },
    onChange(info) {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};
const Demo = () => (React.createElement(Upload, { ...props },
    React.createElement(Button, { icon: React.createElement(UploadOutlined, null) }, "Click to Upload")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorPrimaryHover', 'colorPrimaryActive'],
    key: 'upload',
};
export default componentDemo;
//# sourceMappingURL=upload.js.map