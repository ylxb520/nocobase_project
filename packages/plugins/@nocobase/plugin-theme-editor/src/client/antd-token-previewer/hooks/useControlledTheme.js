/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { theme as antTheme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import deepUpdateObj from '../utils/deepUpdateObj';
import getDesignToken from '../utils/getDesignToken';
import getValueByPath from '../utils/getValueByPath';
const { darkAlgorithm: defaultDark, compactAlgorithm, defaultAlgorithm } = antTheme;
export const themeMap = {
    dark: defaultDark,
    compact: compactAlgorithm,
    default: defaultAlgorithm,
};
const useControlledTheme = ({ theme: customTheme, defaultTheme, onChange }) => {
    const [theme, setTheme] = useState(customTheme ?? defaultTheme);
    const [infoFollowPrimary, setInfoFollowPrimary] = useState(false);
    const themeRef = useRef(theme);
    const [, setRenderHolder] = useState(0);
    const forceUpdate = () => setRenderHolder((prev) => prev + 1);
    const getNewTheme = (newTheme, force) => {
        const newToken = { ...newTheme.config.token };
        if (infoFollowPrimary || force) {
            newToken.colorInfo = getDesignToken(newTheme.config).colorPrimary;
        }
        return { ...newTheme, config: { ...newTheme.config, token: newToken } };
    };
    const handleSetTheme = (newTheme) => {
        if (customTheme) {
            onChange?.(getNewTheme(newTheme));
        }
        else {
            setTheme(getNewTheme(newTheme));
        }
    };
    const handleResetTheme = (path) => {
        let newConfig = { ...theme.config };
        newConfig = deepUpdateObj(newConfig, path, getValueByPath(themeRef.current?.config, path));
        if (path[1] === 'colorSettings') {
            newConfig = deepUpdateObj(newConfig, ['token', 'colorBgSettingsHover'], getValueByPath(themeRef.current?.config, ['token', 'colorBgSettingsHover']));
            newConfig = deepUpdateObj(newConfig, ['token', 'colorTemplateBgSettingsHover'], getValueByPath(themeRef.current?.config, ['token', 'colorTemplateBgSettingsHover']));
            newConfig = deepUpdateObj(newConfig, ['token', 'colorBorderSettingsHover'], getValueByPath(themeRef.current?.config, ['token', 'colorBorderSettingsHover']));
        }
        handleSetTheme({ ...theme, config: newConfig }, path);
    };
    const getCanReset = (origin, current) => (path) => {
        return getValueByPath(origin, path) !== getValueByPath(current, path);
    };
    // Controlled theme change
    useEffect(() => {
        if (customTheme) {
            setTheme(customTheme);
        }
    }, [customTheme]);
    const handleInfoFollowPrimaryChange = (value) => {
        setInfoFollowPrimary(value);
        if (value) {
            setTheme(getNewTheme(theme, true));
        }
    };
    return {
        theme: {
            ...theme,
            onThemeChange: (config, path) => handleSetTheme({ ...theme, config }, path),
            onReset: handleResetTheme,
            getCanReset: getCanReset(themeRef.current?.config, theme.config),
        },
        infoFollowPrimary,
        onInfoFollowPrimaryChange: handleInfoFollowPrimaryChange,
        updateRef: () => {
            themeRef.current = theme;
            forceUpdate();
        },
    };
};
export default useControlledTheme;
//# sourceMappingURL=useControlledTheme.js.map