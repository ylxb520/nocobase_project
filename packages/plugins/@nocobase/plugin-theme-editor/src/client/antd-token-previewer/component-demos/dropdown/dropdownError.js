/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Typography } from 'antd';
import React from 'react';
const Demo = () => (React.createElement("div", null,
    React.createElement(Typography.Text, { type: 'danger', onClick: (e) => e.preventDefault() },
        "Hover me ",
        React.createElement(DownOutlined, null)),
    React.createElement(Dropdown._InternalPanelDoNotUseOrYouWillBeFired, { menu: {
            items: [
                {
                    label: 'item 1',
                    key: '1',
                },
                {
                    label: 'a danger item',
                    danger: true,
                    key: '3',
                },
                {
                    label: 'danger disabled item',
                    danger: true,
                    disabled: true,
                    key: '2',
                },
            ],
        } })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorError', 'colorErrorHover', 'colorBgElevated'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=dropdownError.js.map