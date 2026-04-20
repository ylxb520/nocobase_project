/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Popconfirm, message } from 'antd';
import React from 'react';
function confirm() {
    message.success('Click on Yes');
}
function cancel() {
    message.error('Click on No');
}
const Demo = () => (React.createElement("div", null,
    React.createElement(Popconfirm._InternalPanelDoNotUseOrYouWillBeFired, { title: "Are you sure to delete this task?", onConfirm: confirm, onCancel: cancel, okText: "Yes", cancelText: "No", placement: 'topLeft' })));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgElevated', 'colorWarning'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=popconfirm.js.map