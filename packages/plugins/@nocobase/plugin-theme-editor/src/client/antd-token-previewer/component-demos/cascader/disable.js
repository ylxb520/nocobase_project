/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Cascader } from 'antd';
import React from 'react';
import options from './data';
const { _InternalPanelDoNotUseOrYouWillBeFired: InternalCascader } = Cascader;
const Demo = () => React.createElement(InternalCascader, { options: options, open: true, disabled: true, placeholder: "Please select" });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgContainerDisabled'],
    key: 'disabled',
};
export default componentDemo;
//# sourceMappingURL=disable.js.map