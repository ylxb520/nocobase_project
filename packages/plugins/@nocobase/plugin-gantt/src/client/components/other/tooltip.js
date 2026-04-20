/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { cx } from '@emotion/css';
import React, { useEffect, useRef, useState } from 'react';
import { getYmd } from '../../helpers/other-helper';
import useStyles from './style';
export const Tooltip = ({ task, rowHeight, rtl, svgContainerHeight, svgContainerWidth, scrollX, scrollY, arrowIndent, fontSize, fontFamily, headerHeight, taskListWidth, TooltipContent, }) => {
    const { styles } = useStyles();
    const tooltipRef = useRef(null);
    const [relatedY, setRelatedY] = useState(0);
    const [relatedX, setRelatedX] = useState(0);
    useEffect(() => {
        if (tooltipRef.current) {
            const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
            const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;
            let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
            let newRelatedX;
            if (rtl) {
                newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
                if (newRelatedX < 0) {
                    newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
                }
                const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
                if (tooltipLeftmostPoint > svgContainerWidth) {
                    newRelatedX = svgContainerWidth - tooltipWidth;
                    newRelatedY += rowHeight;
                }
            }
            else {
                newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
                const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
                const fullChartWidth = taskListWidth + svgContainerWidth;
                if (tooltipLeftmostPoint > fullChartWidth) {
                    newRelatedX = task.x1 + taskListWidth - arrowIndent * 1.5 - scrollX - tooltipWidth;
                }
                if (newRelatedX < taskListWidth) {
                    newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
                    newRelatedY += rowHeight;
                }
            }
            const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
            if (tooltipLowerPoint > svgContainerHeight - scrollY) {
                newRelatedY = svgContainerHeight - tooltipHeight;
            }
            setRelatedY(newRelatedY);
            setRelatedX(newRelatedX);
        }
    }, [
        tooltipRef,
        task,
        arrowIndent,
        scrollX,
        scrollY,
        headerHeight,
        taskListWidth,
        rowHeight,
        svgContainerHeight,
        svgContainerWidth,
        rtl,
    ]);
    return (React.createElement("div", { ref: tooltipRef, className: cx(relatedX ? styles.tooltipDetailsContainer : styles.tooltipDetailsContainerHidden, styles.nbGridOther), style: { left: relatedX, top: relatedY } },
        React.createElement(TooltipContent, { task: task, fontSize: fontSize, fontFamily: fontFamily })));
};
export const StandardTooltipContent = ({ task, fontSize, fontFamily }) => {
    const { styles } = useStyles();
    const style = {
        fontSize,
        fontFamily,
    };
    return (React.createElement("div", { className: cx(styles.nbGridOther, styles.tooltipDefaultContainer), "aria-label": "nb-gantt-tooltip", style: style },
        React.createElement("b", { style: { fontSize: fontSize } },
            task.name,
            ": ",
            getYmd(task.start),
            " ~ ",
            getYmd(task.end)),
        task.end?.getTime?.() - task.start?.getTime?.() !== 0 && (React.createElement("p", { className: "tooltipDefaultContainerParagraph" }, `Duration: ${Math.round(((task.end?.getTime?.() - task.start?.getTime?.()) / (1000 * 60 * 60 * 24)) * 10) / 10 || ''} day(s)`)),
        React.createElement("p", { className: "tooltipDefaultContainerParagraph" }, !!task.progress && `Progress: ${task.progress}%`)));
};
//# sourceMappingURL=tooltip.js.map