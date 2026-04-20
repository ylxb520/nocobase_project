/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext } from 'react';
export const MobileTitleContext = createContext(null);
MobileTitleContext.displayName = 'MobileTitleContext';
export const MobileTitleProvider = ({ children, title: defaultTitle }) => {
    const [title, setTitle] = React.useState(defaultTitle);
    return React.createElement(MobileTitleContext.Provider, { value: { title, setTitle } }, children);
};
export const useMobileTitle = () => {
    return React.useContext(MobileTitleContext);
};
//# sourceMappingURL=MobileTitle.js.map