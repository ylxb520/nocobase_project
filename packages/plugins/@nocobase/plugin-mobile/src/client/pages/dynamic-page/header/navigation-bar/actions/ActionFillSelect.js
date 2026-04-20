/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Radio } from 'antd';
import { connect } from '@formily/react';
import React from 'react';
import { Button } from 'antd-mobile';
const fillList = ['solid', 'outline'];
export const ActionFillSelect = connect((props) => {
    return (React.createElement(Radio.Group, { ...props }, fillList.map((fill) => {
        return (React.createElement(Radio, { value: fill, key: fill },
            React.createElement(Button, { color: "primary", size: "mini", fill: fill, style: { width: 10, height: 18 }, onClick: () => props.onChange(fill) })));
    })));
});
//# sourceMappingURL=ActionFillSelect.js.map