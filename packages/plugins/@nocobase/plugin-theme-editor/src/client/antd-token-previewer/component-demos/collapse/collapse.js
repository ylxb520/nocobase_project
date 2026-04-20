/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Collapse } from 'antd';
import React from 'react';
const { Panel } = Collapse;
const text = `  A dog is a type of domesticated animal.  Known for its loyalty and faithfulness,  it can be found as a welcome guest in many households across the world.`;
const Demo = () => (React.createElement(Collapse, { defaultActiveKey: ['1'] },
    React.createElement(Panel, { header: "This is panel header 1", key: "1" },
        React.createElement("p", null, text)),
    React.createElement(Panel, { header: "This is panel header 2", key: "2" },
        React.createElement("p", null, text)),
    React.createElement(Panel, { header: "This is panel header 3", key: "3" },
        React.createElement("p", null, text))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorTextSecondary', 'colorText', 'colorFillAlter', 'colorBgContainer'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=collapse.js.map