/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Modal } from 'antd';
import React from 'react';
const { _InternalPanelDoNotUseOrYouWillBeFired } = Modal;
const Demo = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement(_InternalPanelDoNotUseOrYouWillBeFired, { title: "Basic Modal" },
            React.createElement("p", null, "Some contents..."),
            " ",
            React.createElement("p", null, "Some contents..."),
            " ",
            React.createElement("p", null, "Some contents..."))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorInfo'],
    key: 'info',
};
export default componentDemo;
//# sourceMappingURL=info.js.map