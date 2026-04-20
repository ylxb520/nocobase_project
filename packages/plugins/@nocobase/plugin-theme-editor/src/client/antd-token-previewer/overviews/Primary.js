/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Card, Space } from 'antd';
import React from 'react';
import Button from '../component-demos/button/button-icon';
import Menu from '../component-demos/menu/menu';
import Pagination from '../component-demos/pagination/outline';
import Popconfirm from '../component-demos/popconfirm/popconfirm';
import Radio from '../component-demos/radio/radio';
import Steps from '../component-demos/steps/steps';
import Tabs from '../component-demos/tabs/tabs';
export const Primary = ({ id }) => {
    return (React.createElement(Card, { size: 'small', bordered: false, id: id },
        React.createElement(Space, { direction: 'vertical' },
            React.createElement(Space, { align: 'start', size: 'large' },
                Menu.demo,
                React.createElement(Space, { direction: 'vertical', size: 'large' },
                    React.createElement(Space, { size: 'large', align: 'start' },
                        React.createElement(Space, { direction: 'vertical', size: 'large' },
                            React.createElement("div", null, Button.demo),
                            React.createElement("div", null,
                                React.createElement("span", null, Radio.demo)),
                            Tabs.demo,
                            Popconfirm.demo)),
                    Pagination.demo,
                    React.createElement("div", { style: { padding: 12 } }, Steps.demo),
                    React.createElement(Space, { size: 'large', align: 'start' }))))));
};
Primary.displayName = 'Primary';
//# sourceMappingURL=Primary.js.map