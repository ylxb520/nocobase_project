/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext } from 'react';
export const MobilePageContext = createContext(null);
MobilePageContext.displayName = 'MobilePageContext';
export const MobilePageProvider = ({ children, ...props }) => {
    return React.createElement(MobilePageContext.Provider, { value: props }, children);
};
export const useMobilePage = () => {
    return React.useContext(MobilePageContext);
};
//# sourceMappingURL=context.js.map