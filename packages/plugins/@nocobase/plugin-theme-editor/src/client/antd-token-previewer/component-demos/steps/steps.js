/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Steps } from 'antd';
import React from 'react';
const { Step } = Steps;
const Demo = () => (React.createElement(Steps, { current: 1 },
    React.createElement(Step, { title: "Finished", description: "This is a description." }),
    React.createElement(Step, { title: "In Progress", subTitle: "Left 00:00:08", description: "This is a description." }),
    React.createElement(Step, { title: "Waiting", description: "This is a description." })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorBgContainer'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=steps.js.map