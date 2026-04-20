/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export const BarDateHandle = ({ x, y, width, height, barCornerRadius, onMouseDown }) => {
    return (React.createElement("rect", { x: x, y: y, width: width, height: height, className: 'barHandle', role: "button", ry: barCornerRadius, rx: barCornerRadius, onMouseDown: onMouseDown }));
};
//# sourceMappingURL=bar-date-handle.js.map