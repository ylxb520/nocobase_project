/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { cx } from '@emotion/css';
import React from 'react';
export const TopPartOfCalendar = ({ value, x1Line, y1Line, y2Line, xText, yText, }) => {
    return (React.createElement("g", { className: "calendarTop" },
        React.createElement("line", { x1: x1Line, y1: y1Line, x2: x1Line, y2: y2Line, className: cx('calendarTopTick'), key: value + 'line' }),
        React.createElement("text", { key: value + 'text', y: yText, x: xText, className: cx('calendarTopText') }, value)));
};
//# sourceMappingURL=top-part-of-calendar.js.map