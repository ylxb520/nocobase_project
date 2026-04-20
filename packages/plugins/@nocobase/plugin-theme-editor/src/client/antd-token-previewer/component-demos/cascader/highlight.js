/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Cascader as _Cascader } from 'antd';
import React from 'react';
import options from './data';
const { _InternalPanelDoNotUseOrYouWillBeFired: Cascader } = _Cascader;
const Demo = () => {
    return React.createElement(Cascader, { options: options, placeholder: "Please select", searchValue: 'jiang', showSearch: true });
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorHighlight'],
    key: 'highlight',
};
export default componentDemo;
//# sourceMappingURL=highlight.js.map