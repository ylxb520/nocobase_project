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
const Demo = () => React.createElement(_InternalPanelDoNotUseOrYouWillBeFired, { type: 'info', content: 'Info' });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorInfo'],
    key: 'info',
};
export default componentDemo;
//# sourceMappingURL=info.js.map