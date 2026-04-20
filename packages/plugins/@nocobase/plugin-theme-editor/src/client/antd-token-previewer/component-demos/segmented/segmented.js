/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Segmented } from 'antd';
import React from 'react';
const Demo = () => React.createElement(Segmented, { options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] });
const componentDemo = {
    demo: React.createElement(Demo, null),
    key: 'default',
    tokens: [],
};
export default componentDemo;
//# sourceMappingURL=segmented.js.map