/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Pagination, Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, { direction: 'vertical' },
    React.createElement(Pagination, { showQuickJumper: true, pageSize: 1, defaultCurrent: 2, total: 10 })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'controlOutline', 'colorPrimaryHover', 'colorBgContainer'],
    key: 'outline',
};
export default componentDemo;
//# sourceMappingURL=outline.js.map