/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useContext, useState } from 'react';
const SizeContext = createContext(null);
SizeContext.displayName = 'SizeContext';
export function useSize() {
    return useContext(SizeContext);
}
export const SizeContextProvider = ({ children }) => {
    const [size, setSize] = useState({ width: 375, height: 667 });
    return React.createElement(SizeContext.Provider, { value: { size, setSize } }, children);
};
//# sourceMappingURL=sizeContext.js.map