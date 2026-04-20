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
    React.createElement(Alert, { message: "Informational Notes", type: "info", showIcon: true }),
    React.createElement(Alert, { message: "Informational Notes", description: "Additional description and information about copywriting.", type: "info", showIcon: true })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorInfo', 'colorInfoBorder', 'colorInfoBg'],
    key: 'info',
};
export default componentDemo;
//# sourceMappingURL=info.js.map