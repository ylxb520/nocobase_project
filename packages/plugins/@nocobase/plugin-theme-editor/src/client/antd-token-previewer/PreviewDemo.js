/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { antdComponents } from './component-panel';
import ComponentDemoPro from './token-panel-pro/ComponentDemoPro';
const PreviewDemo = ({ theme, style }) => {
    return (React.createElement("div", { style: { ...style, overflow: 'auto' } },
        React.createElement(ComponentDemoPro, { theme: theme, components: antdComponents, componentDrawer: false, showAll: true, style: { minHeight: '100%' } })));
};
export default PreviewDemo;
//# sourceMappingURL=PreviewDemo.js.map