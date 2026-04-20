/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useRequest } from '@nocobase/client';
import { error } from '@nocobase/utils/client';
import React, { createContext, useMemo } from 'react';
import { changeAlgorithmFromStringToFunction } from '../utils/changeAlgorithmFromStringToFunction';
const ThemeListContext = createContext(null);
ThemeListContext.displayName = 'ThemeListContext';
export const useThemeListContext = () => {
    return React.useContext(ThemeListContext);
};
export const ThemeListProvider = ({ children }) => {
    const { data, error: err, run, refresh, loading, } = useRequest({
        url: 'themeConfig:list',
        params: {
            sort: 'id',
            paginate: false,
        },
    }, {
        manual: true,
    });
    const items = useMemo(() => {
        return data?.data?.map((item) => changeAlgorithmFromStringToFunction(item));
    }, [data]);
    if (err) {
        error(err);
    }
    return (React.createElement(ThemeListContext.Provider, { value: {
            data: items,
            error: err,
            run,
            refresh,
            loading,
        } }, children));
};
ThemeListProvider.displayName = 'ThemeListProvider';
//# sourceMappingURL=ThemeListProvider.js.map