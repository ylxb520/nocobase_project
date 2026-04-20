/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Modal } from 'antd';
import React from 'react';
const Demo = () => {
    return (React.createElement(Modal._InternalPanelDoNotUseOrYouWillBeFired, { type: 'confirm', title: 'Confirm This?' }, "Some descriptions."));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorWarning'],
    key: 'warning',
};
export default componentDemo;
//# sourceMappingURL=warning.js.map