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
const Demo = () => React.createElement(Tag, { closable: true }, "Error");
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorFillAlter', 'colorIcon', 'colorIconHover'],
    key: 'closable',
};
export default componentDemo;
//# sourceMappingURL=closable.js.map