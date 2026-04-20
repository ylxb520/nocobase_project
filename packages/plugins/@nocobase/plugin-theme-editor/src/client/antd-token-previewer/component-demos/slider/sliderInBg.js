/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Slider, theme } from 'antd';
import React from 'react';
const Demo = () => {
    const { token } = theme.useToken();
    return (React.createElement("div", { style: { padding: 12, background: token.colorFillSecondary } },
        React.createElement(Slider, { defaultValue: 30 }),
        React.createElement(Slider, { range: true, defaultValue: [20, 50] })));
};
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
    key: 'sliderInBg',
};
export default componentDemo;
//# sourceMappingURL=sliderInBg.js.map