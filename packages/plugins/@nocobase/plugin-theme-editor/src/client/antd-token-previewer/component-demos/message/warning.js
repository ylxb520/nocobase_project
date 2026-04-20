/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { message } from 'antd';
import React from 'react';
const { _InternalPanelDoNotUseOrYouWillBeFired } = message;
const Demo = () => React.createElement(_InternalPanelDoNotUseOrYouWillBeFired, { type: 'warning', content: '这是一条警告消息，会主动消失' });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorWarning'],
    key: 'warning',
};
export default componentDemo;
//# sourceMappingURL=warning.js.map