/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { cx } from '@emotion/css';
import { uid } from '@nocobase/utils/client';
import React from 'react';
import { addToDate } from '../../helpers/date-helper';
import useStyles from './style';
const empty = [{ id: uid() }, { id: uid() }, { id: uid() }];
export const GridBody = ({ tasks, dates, rowHeight, svgWidth, columnWidth, todayColor, rtl, selectedRowKeys, }) => {
    const { styles } = useStyles();
    const data = tasks.length ? tasks : empty;
    let y = 0;
    const gridRows = [];
    const rowLines = [
        React.createElement("line", { key: "RowLineFirst", x: "0", y1: 0, x2: svgWidth, y2: 0, className: cx('gridRowLine') }),
    ];
    for (const task of data) {
        gridRows.push(React.createElement("rect", { key: 'Row' + task.id, x: "0", y: y, width: svgWidth, height: rowHeight, className: selectedRowKeys?.includes(+task.id) ? styles.gridHeightRow : styles.gridRow }));
        rowLines.push(React.createElement("line", { key: 'RowLine' + task.id, x: "0", y1: y + rowHeight, x2: svgWidth, y2: y + rowHeight, className: cx('gridRowLine') }));
        y += rowHeight;
    }
    const now = new Date();
    let tickX = 0;
    const ticks = [];
    let today = React.createElement("rect", null);
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        ticks.push(React.createElement("line", { key: date.getTime(), x1: tickX, y1: 0, x2: tickX, y2: y, className: cx('gridTick') }));
        if ((i + 1 !== dates.length && date.getTime() < now.getTime() && dates[i + 1].getTime() >= now.getTime()) ||
            // if current date is last
            (i !== 0 &&
                i + 1 === dates.length &&
                date.getTime() < now.getTime() &&
                addToDate(date, date.getTime() - dates[i - 1].getTime(), 'millisecond').getTime() >= now.getTime())) {
            today = React.createElement("rect", { x: tickX, y: 0, width: columnWidth, height: y, fill: todayColor });
        }
        // rtl for today
        if (rtl && i + 1 !== dates.length && date.getTime() >= now.getTime() && dates[i + 1].getTime() < now.getTime()) {
            today = React.createElement("rect", { x: tickX + columnWidth, y: 0, width: columnWidth, height: y, fill: todayColor });
        }
        tickX += columnWidth;
    }
    return (React.createElement("g", { className: cx(`gridBody`, styles.nbGridbody) },
        React.createElement("g", { className: "rows" }, gridRows),
        React.createElement("g", { className: "rowLines" }, rowLines),
        React.createElement("g", { className: "ticks" }, ticks),
        React.createElement("g", { className: "today" }, today)));
};
//# sourceMappingURL=grid-body.js.map