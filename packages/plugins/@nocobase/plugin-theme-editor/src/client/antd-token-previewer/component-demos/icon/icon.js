/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { HomeOutlined, LoadingOutlined, SettingFilled, SmileOutlined, SyncOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, null,
    React.createElement(HomeOutlined, null),
    " ",
    React.createElement(SettingFilled, null),
    " ",
    React.createElement(SmileOutlined, null),
    " ",
    React.createElement(SyncOutlined, { spin: true }),
    React.createElement(SmileOutlined, { rotate: 180 }),
    " ",
    React.createElement(LoadingOutlined, null)));
const componentDemo = {
    demo: React.createElement(Demo, null),
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=icon.js.map