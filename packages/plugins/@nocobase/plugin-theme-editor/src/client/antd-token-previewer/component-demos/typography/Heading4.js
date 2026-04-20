/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Typography } from 'antd';
import React from 'react';
const { Title } = Typography;
const Demo = () => React.createElement(Title, { level: 4 }, "Heading 4");
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['fontSizeHeading4'],
    key: 'heading4',
};
export default componentDemo;
//# sourceMappingURL=Heading4.js.map