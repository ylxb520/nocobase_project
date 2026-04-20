/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { forwardRef, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { Calendar } from '../calendar/calendar';
import { Grid } from '../grid/grid';
import { TaskGanttContent } from './task-gantt-content';
import useStyles from './style';
export const TaskGantt = forwardRef(({ gridProps, calendarProps, barProps, ganttHeight, scrollY, scrollX }, ref) => {
    const ganttSVGRef = useRef(null);
    const horizontalContainerRef = useRef(null);
    const newBarProps = { ...barProps, svg: ganttSVGRef };
    const { styles } = useStyles();
    useEffect(() => {
        if (horizontalContainerRef.current) {
            horizontalContainerRef.current.scrollTop = scrollY;
        }
    }, [scrollY]);
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollLeft = scrollX;
        }
    }, [scrollX]);
    return (React.createElement("div", { className: styles.ganttverticalcontainer, ref: ref, dir: "ltr" },
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: gridProps.svgWidth, height: calendarProps.headerHeight, fontFamily: barProps.fontFamily, className: "ganttHeader" },
            React.createElement(Calendar, { ...calendarProps })),
        React.createElement(Spin, { spinning: barProps?.loading },
            React.createElement("div", { ref: horizontalContainerRef, className: styles.horizontalcontainer, style: ganttHeight ? { maxHeight: ganttHeight, width: gridProps.svgWidth } : { width: gridProps.svgWidth } },
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: gridProps.svgWidth, height: barProps.rowHeight * barProps.tasks.length || 166, fontFamily: barProps.fontFamily, ref: ganttSVGRef, className: "ganttBody" },
                    React.createElement(Grid, { ...gridProps }),
                    React.createElement(TaskGanttContent, { ...newBarProps }))))));
});
TaskGantt.displayName = 'TaskGantt';
//# sourceMappingURL=task-gantt.js.map