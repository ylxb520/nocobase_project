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
import { projectBackground, projectWrapper } from './style';
export const Project = ({ task, isSelected }) => {
    const barColor = isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
    const processColor = isSelected ? task.styles.progressSelectedColor : task.styles.progressColor;
    const projectWith = task.x2 - task.x1;
    return (React.createElement("g", { tabIndex: 0, className: cx(projectWrapper) },
        React.createElement("rect", { fill: task.color || barColor, x: task.x1, width: projectWith, y: task.y, height: task.height, rx: task.barCornerRadius, ry: task.barCornerRadius, className: cx(projectBackground) }),
        React.createElement("rect", { x: task.progressX, width: task.progressWidth, y: task.y, height: task.height, ry: task.barCornerRadius, rx: task.barCornerRadius, fill: task.color || processColor })));
};
//# sourceMappingURL=project.js.map