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
    React.createElement(Alert, { message: "Error", type: "error", showIcon: true }),
    React.createElement(Alert, { message: "Error", description: "This is an error message about copywriting.", type: "error", showIcon: true })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorErrorBg', 'colorErrorBorder', 'colorError'],
    key: 'error',
};
export default componentDemo;
//# sourceMappingURL=error.js.map