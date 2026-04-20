/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Image } from 'antd';
import React from 'react';
const Demo = () => {
    return React.createElement(Image, { width: 200, src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" });
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgMask'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=image.js.map