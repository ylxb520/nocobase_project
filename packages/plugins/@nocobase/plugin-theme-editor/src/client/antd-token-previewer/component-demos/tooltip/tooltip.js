/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Tooltip } from 'antd';
import React from 'react';
const Demo = () => (React.createElement("div", null,
    React.createElement(Tooltip._InternalPanelDoNotUseOrYouWillBeFired, { title: "prompt text" }),
    React.createElement("span", null, "Tooltip will show on mouse enter.")));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgSpotlight', 'colorTextLightSolid'],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=tooltip.js.map