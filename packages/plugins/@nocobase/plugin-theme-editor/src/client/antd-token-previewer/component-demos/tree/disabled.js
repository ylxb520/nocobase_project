/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Tree } from 'antd';
import React from 'react';
const treeData = [
    {
        title: 'parent 1',
        key: '0-0',
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0',
                disabled: true,
                children: [
                    { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
                    { title: 'leaf', key: '0-0-0-1' },
                ],
            },
            {
                title: 'parent 1-1',
                key: '0-0-1',
                children: [
                    {
                        title: React.createElement("span", { style: { color: '#1890ff' } }, "sss"),
                        key: '0-0-1-0',
                    },
                ],
            },
        ],
    },
];
const Demo = () => {
    return (React.createElement(Tree, { disabled: true, checkable: true, defaultExpandedKeys: ['0-0-0', '0-0-1'], defaultSelectedKeys: ['0-0-0', '0-0-1'], defaultCheckedKeys: ['0-0-0', '0-0-1'], treeData: treeData }));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorTextDisabled', 'colorBgContainerDisabled'],
    key: 'disabled',
};
export default componentDemo;
//# sourceMappingURL=disabled.js.map