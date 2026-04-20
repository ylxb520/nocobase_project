/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useContext, useState } from 'react';
export const NotificationTypeNameContext = createContext({ name: '', setName: () => { } });
NotificationTypeNameContext.displayName = 'ChannelTypeContext';
export const NotificationTypesContext = createContext({ channelTypes: [] });
NotificationTypesContext.displayName = 'ChannelTypesContext';
export const useChannelTypes = () => {
    const { channelTypes: types } = useContext(NotificationTypesContext);
    return types;
};
export function useNotificationTypeNameProvider() {
    const [name, setName] = useState('');
    const NotificationTypeNameProvider = ({ children }) => (React.createElement(NotificationTypeNameContext.Provider, { value: { name, setName } }, children));
    return { name, setName, NotificationTypeNameProvider };
}
//# sourceMappingURL=context.js.map