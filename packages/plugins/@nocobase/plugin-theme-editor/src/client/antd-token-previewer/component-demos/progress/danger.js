/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Flexbox } from '@arvinxu/layout-kit';
import { Progress } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Flexbox, { gap: 12 },
    React.createElement(Flexbox, { horizontal: true, gap: 24 },
        React.createElement(Progress, { percent: 70, status: "exception", type: 'dashboard' }),
        React.createElement(Progress, { percent: 80, status: "exception", type: 'circle' })),
    React.createElement(Progress, { percent: 50, status: "exception" })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError'],
    key: 'danger',
};
export default componentDemo;
//# sourceMappingURL=danger.js.map