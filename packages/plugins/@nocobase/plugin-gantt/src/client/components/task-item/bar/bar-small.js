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
import { BarDisplay } from './bar-display';
import { BarProgressHandle } from './bar-progress-handle';
import { barWrapper } from './style';
export const BarSmall = ({ task, isProgressChangeable, isDateChangeable, onEventStart, isSelected, }) => {
    const progressPoint = getProgressPoint(task.progressWidth + task.x1 + 10, task.y, task.height);
    return (React.createElement("g", { className: cx(barWrapper), tabIndex: 0 },
        React.createElement(BarDisplay, { x: task.x1, y: task.y, width: task.x2 - task.x1, height: task.height, progressX: task.progressX, progressWidth: task.progressWidth, barCornerRadius: task.barCornerRadius, styles: task.styles, isSelected: isSelected, onMouseDown: (e) => {
                isDateChangeable && onEventStart('move', task, e);
            } }),
        React.createElement("g", { className: "handleGroup" }, isProgressChangeable && (React.createElement(BarProgressHandle, { progressPoint: progressPoint, onMouseDown: (e) => {
                onEventStart('progress', task, e);
            } })))));
};
//# sourceMappingURL=bar-small.js.map