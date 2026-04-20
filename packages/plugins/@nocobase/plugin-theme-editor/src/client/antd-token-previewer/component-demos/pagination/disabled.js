/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Pagination } from 'antd';
import React from 'react';
const Demo = () => React.createElement(Pagination, { showQuickJumper: true, defaultCurrent: 2, total: 10, disabled: true });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['controlItemBgActiveDisabled', 'colorBgContainerDisabled', 'colorFillAlter'],
    key: 'disabled',
};
export default componentDemo;
//# sourceMappingURL=disabled.js.map