/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Alert, Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, { direction: 'vertical' },
    React.createElement(Alert, { message: "Success Tips", type: "success", showIcon: true }),
    React.createElement(Alert, { message: "Success Tips", description: "Detailed description and advice about successful copywriting.", type: "success", showIcon: true })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSuccess', 'colorSuccessBorder', 'colorSuccessBg'],
    key: 'success',
};
export default componentDemo;
//# sourceMappingURL=success.js.map