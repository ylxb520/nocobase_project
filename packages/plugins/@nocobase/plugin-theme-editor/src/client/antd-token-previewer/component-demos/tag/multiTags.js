/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Tag } from 'antd';
import React from 'react';
const { CheckableTag } = Tag;
const Checkable = () => (React.createElement("div", null,
    React.createElement(CheckableTag, { checked: true }, "Error"),
    React.createElement(CheckableTag, { checked: false }, "Error")));
const componentDemo = {
    demo: React.createElement(Checkable, null),
    tokens: ['colorPrimary', 'colorPrimaryHover', 'colorPrimaryActive'],
    key: 'multiTags',
};
export default componentDemo;
//# sourceMappingURL=multiTags.js.map