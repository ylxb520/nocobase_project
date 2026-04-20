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
    React.createElement(Timeline.Item, { color: 'red' }, "Create a services site 2015-09-01"),
    React.createElement(Timeline.Item, { color: 'red' }, "Solve initial network problems 2015-09-01"),
    React.createElement(Timeline.Item, { color: 'red' }, "Technical testing 2015-09-01"),
    React.createElement(Timeline.Item, { color: 'red' }, "Network problems being solved 2015-09-01")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError'],
    key: 'danger',
};
export default componentDemo;
//# sourceMappingURL=danger.js.map