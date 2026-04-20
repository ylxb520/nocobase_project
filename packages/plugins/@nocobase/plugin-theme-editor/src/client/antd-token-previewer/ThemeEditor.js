/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import classNames from 'classnames';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { antdComponents } from './component-panel';
import useControlledTheme from './hooks/useControlledTheme';
import { LocaleContext, zhCN } from './locale';
import { mapRelatedAlias, seedRelatedAlias, seedRelatedMap } from './meta/TokenRelation';
import TokenPanelPro from './token-panel-pro';
import ComponentDemoPro from './token-panel-pro/ComponentDemoPro';
import makeStyle from './utils/makeStyle';
import { getRelatedComponents } from './utils/statistic';
const useStyle = makeStyle('ThemeEditor', (token) => ({
    '.antd-theme-editor': {
        backgroundColor: token.colorBgLayout,
        display: 'flex',
    },
}));
const defaultTheme = {
    name: '默认主题',
    key: 'default',
    config: {},
};
const ThemeEditor = forwardRef(({ theme: customTheme, onThemeChange, className, style, darkAlgorithm, locale = zhCN }, ref) => {
    const [wrapSSR, hashId] = useStyle();
    const [selectedTokens, setSelectedTokens] = useState({
        seed: ['colorPrimary'],
    });
    const [aliasOpen, setAliasOpen] = useState(false);
    const { theme, infoFollowPrimary, onInfoFollowPrimaryChange, updateRef } = useControlledTheme({
        theme: customTheme,
        defaultTheme,
        onChange: onThemeChange,
        darkAlgorithm,
    });
    useImperativeHandle(ref, () => ({
        updateRef,
    }));
    const handleTokenSelect = (token, type) => {
        setSelectedTokens((prev) => {
            const tokens = typeof token === 'string' ? (token ? [token] : []) : token;
            if (type === 'seed') {
                return {
                    seed: tokens,
                };
            }
            let newSelectedTokens = { ...prev };
            tokens.forEach((newToken) => {
                newSelectedTokens = {
                    ...prev,
                    [type]: prev[type]?.includes(newToken)
                        ? prev[type]?.filter((t) => t !== newToken)
                        : [...(prev[type] ?? []), newToken],
                };
            });
            if (type === 'map') {
                delete newSelectedTokens.alias;
            }
            return newSelectedTokens;
        });
    };
    const computedSelectedTokens = useMemo(() => {
        if (selectedTokens.seed?.length && !selectedTokens.map?.length && !selectedTokens.alias?.length) {
            return [
                ...selectedTokens.seed,
                ...(seedRelatedMap[selectedTokens.seed[0]] ?? []),
                ...(seedRelatedAlias[selectedTokens.seed[0]] ?? []),
            ];
        }
        if (selectedTokens.map?.length && !selectedTokens.alias?.length) {
            return [
                ...selectedTokens.map,
                ...selectedTokens.map.reduce((result, item) => {
                    return result.concat(mapRelatedAlias[item]);
                }, []),
            ];
        }
        if (selectedTokens.alias?.length) {
            return [...selectedTokens.alias];
        }
        return [];
    }, [selectedTokens]);
    const relatedComponents = useMemo(() => {
        return computedSelectedTokens ? getRelatedComponents(computedSelectedTokens) : [];
    }, [computedSelectedTokens]);
    return wrapSSR(React.createElement(LocaleContext.Provider, { value: locale },
        React.createElement("div", { className: classNames(hashId, 'antd-theme-editor', className), style: style },
            React.createElement("div", { style: {
                    flex: aliasOpen ? '0 0 860px' : `0 0 ${860 - 320}px`,
                    height: '100%',
                    backgroundColor: '#F7F8FA',
                    backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, rgba(246,247,249,0.00) 100%)',
                    display: 'flex',
                    transition: 'all 0.3s',
                } },
                React.createElement(TokenPanelPro, { aliasOpen: aliasOpen, onAliasOpenChange: (open) => setAliasOpen(open), theme: theme, style: { flex: 1 }, selectedTokens: selectedTokens, onTokenSelect: handleTokenSelect, infoFollowPrimary: infoFollowPrimary, onInfoFollowPrimaryChange: onInfoFollowPrimaryChange })),
            React.createElement(ComponentDemoPro, { theme: theme, components: antdComponents, activeComponents: relatedComponents, selectedTokens: computedSelectedTokens, style: { flex: 1, overflow: 'auto', height: '100%' }, componentDrawer: true }))));
});
ThemeEditor.displayName = 'ThemeEditor';
export default ThemeEditor;
//# sourceMappingURL=ThemeEditor.js.map