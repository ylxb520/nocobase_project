/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observer } from '@nocobase/flow-engine';
import { Button } from 'antd';
import React, { useContext, useMemo } from 'react';
import { CalendarToolbarContext } from './context';
import { getLunarDay } from './utils';
import { useDesignable } from '@nocobase/client';
export const Title = observer(() => {
    const { DesignableBar } = useDesignable();
    const { date, view, label, showLunar } = useContext(CalendarToolbarContext);
    const lunarElement = useMemo(() => {
        if (!showLunar || view !== 'day') {
            return;
        }
        return React.createElement("span", null, getLunarDay(date));
    }, [view, date, showLunar]);
    return (React.createElement(Button.Group, { style: { fontSize: '1.75em', fontWeight: 300 } },
        React.createElement("span", null, label),
        React.createElement("span", { style: { marginLeft: '4px' } }, lunarElement),
        React.createElement(DesignableBar, null)));
}, { displayName: 'Title' });
//# sourceMappingURL=Title.js.map