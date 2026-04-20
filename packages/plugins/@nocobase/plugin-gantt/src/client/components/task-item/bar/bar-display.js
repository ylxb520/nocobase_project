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
import { barBackground } from './style';
export const BarDisplay = ({ x, y, color, width, height, isSelected, progressX, progressWidth, barCornerRadius, styles, onMouseDown, }) => {
    const getProcessColor = () => {
        if (color) {
            return color;
        }
        return isSelected ? styles.progressSelectedColor : styles.progressColor;
    };
    const getBarColor = () => {
        if (color) {
            return color;
        }
        return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
    };
    return (React.createElement("g", { onMouseDown: onMouseDown },
        React.createElement("rect", { x: x, width: width, y: y, height: height, ry: barCornerRadius, rx: barCornerRadius, fill: getBarColor(), className: cx(barBackground) }),
        React.createElement("rect", { x: progressX, width: progressWidth, y: y, height: height, ry: barCornerRadius, rx: barCornerRadius, fill: getProcessColor() })));
};
//# sourceMappingURL=bar-display.js.map