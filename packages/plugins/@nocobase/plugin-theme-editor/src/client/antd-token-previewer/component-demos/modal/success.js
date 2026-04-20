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
    return (React.createElement(Modal._InternalPanelDoNotUseOrYouWillBeFired, { type: 'success' }, "A good news!"));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorSuccess'],
    key: 'success',
};
export default componentDemo;
//# sourceMappingURL=success.js.map