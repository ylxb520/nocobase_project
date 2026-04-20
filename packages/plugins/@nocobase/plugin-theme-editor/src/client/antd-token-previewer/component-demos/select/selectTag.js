/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import Select from './_internal';
import React from 'react';
import options from './data';
const handleChange = (value) => {
    console.log(`selected ${value}`);
};
const Demo = () => (React.createElement(Select, { mode: "multiple", allowClear: true, style: {
        width: '100%',
    }, options: options, listHeight: 200, placeholder: "Please select", defaultValue: ['a10', 'c12', 'e14'], onChange: handleChange }));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimary', 'colorFillSecondary'],
    key: 'selectTag',
};
export default componentDemo;
//# sourceMappingURL=selectTag.js.map