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
    React.createElement(Alert, { message: "Informational Notes", type: "info", showIcon: true }),
    React.createElement(Alert, { message: "Warning", type: "warning", showIcon: true, closable: true }),
    React.createElement(Alert, { message: "Error", type: "error", showIcon: true })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorIconHover', 'colorIcon', 'colorText'],
    key: 'alert',
};
export default componentDemo;
//# sourceMappingURL=alert.js.map