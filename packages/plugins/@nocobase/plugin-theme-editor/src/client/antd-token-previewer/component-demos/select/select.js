/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Select as _Select, Space } from 'antd';
import React from 'react';
const { Option, _InternalPanelDoNotUseOrYouWillBeFired: Select } = _Select;
function handleChange() { }
const Demo = () => (React.createElement(Space, { align: 'start' },
    React.createElement(Select, { defaultValue: "lucy", style: { width: 120 }, onChange: handleChange },
        React.createElement(Option, { value: "jack" }, "Jack"),
        " ",
        React.createElement(Option, { value: "lucy" }, "Lucy"),
        React.createElement(Option, { value: "disabled", disabled: true }, "Disabled"),
        React.createElement(Option, { value: "Yiminghe" }, "yiminghe")),
    React.createElement(Select, { defaultValue: "lucy", style: { width: 120 }, disabled: true },
        React.createElement(Option, { value: "lucy" }, "Lucy")),
    React.createElement(Select, { defaultValue: "lucy", style: { width: 120 }, loading: true },
        React.createElement(Option, { value: "lucy" }, "Lucy")),
    React.createElement(Select, { defaultValue: "lucy", style: { width: 120 }, allowClear: true },
        React.createElement(Option, { value: "lucy" }, "Lucy"))));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['controlOutline', 'colorPrimary', 'colorPrimaryHover', 'colorText', 'colorBgElevated', 'colorBgContainer'],
    key: 'select',
};
export default componentDemo;
//# sourceMappingURL=select.js.map