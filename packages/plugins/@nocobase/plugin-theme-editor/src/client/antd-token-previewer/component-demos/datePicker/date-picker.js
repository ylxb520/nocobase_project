/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DatePicker, Space } from 'antd';
import React from 'react';
const Demo = () => (React.createElement(Space, { direction: "vertical" },
    React.createElement(DatePicker._InternalPanelDoNotUseOrYouWillBeFired, { picker: "week" }),
    React.createElement(DatePicker._InternalPanelDoNotUseOrYouWillBeFired, { picker: "month" }),
    React.createElement(DatePicker._InternalPanelDoNotUseOrYouWillBeFired, { picker: "quarter" }),
    React.createElement(DatePicker._InternalPanelDoNotUseOrYouWillBeFired, { picker: "year" })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: [
        'colorPrimary',
        'colorPrimaryBorder',
        'colorPrimaryHover',
        'controlOutline',
        'colorBgElevated',
        'colorBgContainer',
    ],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=date-picker.js.map