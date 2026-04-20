/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Slider } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(React.Fragment, null,
    React.createElement(Slider, { defaultValue: 30 }),
    React.createElement(Slider, { range: true, defaultValue: [20, 50] })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: [
        'colorFillSecondary',
        'colorFillContentHover',
        'colorBgContainer',
        'colorPrimary',
        'colorPrimaryHover',
        'colorPrimaryBorderHover',
        'colorPrimaryBorder',
    ],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=slider.js.map