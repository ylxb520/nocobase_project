/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import React from 'react';
import menu from './menu';
const Demo = () => (React.createElement("div", null,
    React.createElement("a", { className: "ant-dropdown-link", onClick: (e) => e.preventDefault() },
        "Hover me ",
        React.createElement(DownOutlined, null)),
    React.createElement(Dropdown._InternalPanelDoNotUseOrYouWillBeFired, { overlay: menu })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorError', 'colorErrorHover', 'colorBgElevated'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=dropdown.js.map