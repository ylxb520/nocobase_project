/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DownOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
const menu = (React.createElement(Menu, null,
    React.createElement(Menu.Item, null,
        React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.antgroup.com" }, "1st menu item")),
    React.createElement(Menu.Item, { icon: React.createElement(DownOutlined, null), disabled: true },
        React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.aliyun.com" }, "2nd menu item (disabled)")),
    React.createElement(Menu.Item, { disabled: true },
        React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.luohanacademy.com" }, "3rd menu item (disabled)")),
    React.createElement(Menu.Item, { danger: true }, "a danger item")));
export default menu;
//# sourceMappingURL=menu.js.map