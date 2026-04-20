/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Carousel } from 'antd';
import React from 'react';
const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};
const Demo = () => (React.createElement(Carousel, null,
    React.createElement("div", null,
        React.createElement("h3", { style: contentStyle }, "1")),
    React.createElement("div", null,
        React.createElement("h3", { style: contentStyle }, "2")),
    React.createElement("div", null,
        React.createElement("h3", { style: contentStyle }, "3")),
    React.createElement("div", null,
        React.createElement("h3", { style: contentStyle }, "4"))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorText', 'colorBgContainer'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=carousel.js.map