/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Skeleton } from 'antd';
import React from 'react';
const Demo = () => React.createElement(Skeleton, { active: true });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorFillContent', 'colorTextPlaceholder'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=skeleton.js.map