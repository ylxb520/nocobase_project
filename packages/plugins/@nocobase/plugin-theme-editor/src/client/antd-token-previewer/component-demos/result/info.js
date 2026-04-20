/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Result } from 'antd';
import React from 'react';
const Demo = () => React.createElement(Result, { status: 'info', title: "Demo\u793A\u610F", subTitle: "status \u4E3Ainfo" });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorInfo'],
    key: 'info',
};
export default componentDemo;
//# sourceMappingURL=info.js.map