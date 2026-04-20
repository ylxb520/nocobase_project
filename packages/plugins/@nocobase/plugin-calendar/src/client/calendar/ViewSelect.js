/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observer } from '@nocobase/flow-engine';
import { Select } from 'antd';
import React, { useContext } from 'react';
import { CalendarToolbarContext } from './context';
import { useDesignable } from '@nocobase/client';
export const ViewSelect = observer((props) => {
    const { DesignableBar } = useDesignable();
    const { views, view, onView, localizer: { messages }, } = useContext(CalendarToolbarContext);
    return (React.createElement("div", { className: "ant-btn-group" },
        React.createElement(Select, { popupMatchSelectWidth: false, value: view, onChange: onView }, views.map((name) => (React.createElement(Select.Option, { key: name, value: name }, messages[name])))),
        React.createElement(DesignableBar, null)));
}, { displayName: 'ViewSelect' });
//# sourceMappingURL=ViewSelect.js.map