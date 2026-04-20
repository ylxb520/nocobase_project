/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Timeline } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Timeline, null,
    React.createElement(Timeline.Item, { color: 'green' }, "Create a services site 2015-09-01"),
    React.createElement(Timeline.Item, { color: 'green' }, "Solve initial network problems 2015-09-01"),
    React.createElement(Timeline.Item, { color: 'green' }, "Technical testing 2015-09-01"),
    React.createElement(Timeline.Item, { color: 'green' }, "Network problems being solved 2015-09-01")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSuccess'],
    key: 'success',
};
export default componentDemo;
//# sourceMappingURL=success.js.map