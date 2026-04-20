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
import { getProgressPoint } from '../../../helpers/bar-helper';
import { BarDateHandle } from './bar-date-handle';
import { BarDisplay } from './bar-display';
import { BarProgressHandle } from './bar-progress-handle';
import { barWrapper } from './style';
export const Bar = ({ task, isProgressChangeable, isDateChangeable, rtl, onEventStart, isSelected, }) => {
    const progressPoint = getProgressPoint(+!rtl * task.progressWidth + task.progressX, task.y, task.height);
    const handleHeight = task.height - 2;
    return (React.createElement("g", { className: cx(barWrapper), "aria-label": "task-bar", tabIndex: 0 },
        React.createElement(BarDisplay, { x: task.x1, y: task.y, color: task.color, width: task.x2 - task.x1, height: task.height, progressX: task.progressX, progressWidth: task.progressWidth, barCornerRadius: task.barCornerRadius, styles: task.styles, isSelected: isSelected, onMouseDown: (e) => {
                isDateChangeable && onEventStart('move', task, e);
            } }),
        React.createElement("g", { className: "handleGroup" },
            isDateChangeable && (React.createElement("g", null,
                React.createElement(BarDateHandle, { x: task.x1 + 1, y: task.y + 1, width: task.handleWidth, height: handleHeight, barCornerRadius: task.barCornerRadius, onMouseDown: (e) => {
                        onEventStart('start', task, e);
                    } }),
                React.createElement(BarDateHandle, { x: task.x2 - task.handleWidth - 1, y: task.y + 1, width: task.handleWidth, height: handleHeight, barCornerRadius: task.barCornerRadius, onMouseDown: (e) => {
                        onEventStart('end', task, e);
                    } }))),
            isProgressChangeable && (React.createElement(BarProgressHandle, { progressPoint: progressPoint, onMouseDown: (e) => {
                    onEventStart('progress', task, e);
                } })))));
};
//# sourceMappingURL=bar.js.map