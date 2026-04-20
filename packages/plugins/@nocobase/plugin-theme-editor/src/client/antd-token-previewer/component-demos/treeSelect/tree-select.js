/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { TreeSelect as _TreeSelect } from 'antd';
import React, { useState } from 'react';
const { TreeNode, _InternalPanelDoNotUseOrYouWillBeFired: TreeSelect } = _TreeSelect;
const Demo = () => {
    const [value, setValue] = useState(undefined);
    const onChange = () => {
        setValue(value);
    };
    return (React.createElement(TreeSelect, { showSearch: true, style: { width: '100%' }, value: value, dropdownStyle: { maxHeight: 400, overflow: 'auto' }, placeholder: "Please select", allowClear: true, treeDefaultExpandAll: true, onChange: onChange },
        React.createElement(TreeNode, { value: "parent 1", title: "parent 1" },
            React.createElement(TreeNode, { value: "parent 1-0", title: "parent 1-0" },
                React.createElement(TreeNode, { value: "leaf1", title: "leaf1" }),
                React.createElement(TreeNode, { value: "leaf2", title: "leaf2" })),
            React.createElement(TreeNode, { value: "parent 1-1", title: "parent 1-1" },
                React.createElement(TreeNode, { value: "leaf3", title: 'leaf3' })))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorPrimaryActive', 'controlOutline', 'colorBgElevated', 'colorBgContainer'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=tree-select.js.map