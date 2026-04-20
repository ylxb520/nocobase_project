/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React from 'react';
const Demo = () => (React.createElement("div", null,
    React.createElement(Upload, { defaultFileList: [
            {
                uid: '3',
                name: 'zzz.png',
                status: 'error',
                response: 'Server Error 500',
                url: 'http://www.baidu.com/zzz.png',
            },
        ] },
        React.createElement(Button, { icon: React.createElement(UploadOutlined, null) }, "Upload")),
    React.createElement(Upload, { listType: 'picture', defaultFileList: [
            {
                uid: '3',
                name: 'zzz.png',
                status: 'error',
                response: 'Server Error 500',
            },
        ] },
        React.createElement(Button, { icon: React.createElement(UploadOutlined, null) }, "Upload"))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'colorErrorBg'],
    key: 'danger',
};
export default componentDemo;
//# sourceMappingURL=danger.js.map