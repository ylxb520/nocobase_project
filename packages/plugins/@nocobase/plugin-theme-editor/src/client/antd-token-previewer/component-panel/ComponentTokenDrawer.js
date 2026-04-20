/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BuildOutlined, CarOutlined } from '@ant-design/icons';
import { ConfigProvider, Drawer, Empty, Tag, Tooltip, theme as antdTheme } from 'antd';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import ComponentDemos from '../component-demos';
import { useLocale } from '../locale';
import TokenCard from '../token-panel/token-card';
import getDesignToken from '../utils/getDesignToken';
import makeStyle from '../utils/makeStyle';
import { getComponentToken } from '../utils/statistic';
import ComponentCard from './ComponentCard';
const { defaultAlgorithm } = antdTheme;
const useStyle = makeStyle('ComponentTokenDrawer', (token) => ({
    '.previewer-component-token-drawer': {
        [`&${token.rootCls}-drawer ${token.rootCls}-drawer-body`]: {
            padding: '0 !important',
        },
        '.previewer-component-drawer-subtitle': {
            fontWeight: token.fontWeightStrong,
            marginBottom: token.marginSM,
            marginInlineStart: token.marginXS,
            color: token.colorText,
        },
        '.previewer-component-token-drawer-theme': {
            fontWeight: 'normal',
            marginInlineStart: 8,
            borderRadius: 4,
            backgroundColor: token.colorInfoBg,
            color: token.colorPrimary,
            borderColor: token.colorInfoBg,
        },
    },
}));
const useComponentFullDemosStyle = makeStyle('ComponentFullDemos', (token) => ({
    '.previewer-component-full-demos': {
        flex: 1,
        overflow: 'auto',
        padding: 24,
        backgroundColor: token.colorBgLayout,
        '> *:not(:last-child)': {
            marginBottom: 12,
        },
    },
}));
const ComponentFullDemos = ({ demos }) => {
    const [, hashId] = useComponentFullDemosStyle();
    const locale = useLocale();
    return (React.createElement("div", { className: classNames('previewer-component-full-demos', hashId), style: {} }, demos?.map((demo) => (React.createElement(ComponentCard, { key: demo.key, title: React.createElement(Tooltip, { title: demo.tokens?.join(', ') },
            React.createElement("span", null,
                locale.relatedTokens,
                ": ",
                demo.tokens?.join(', '),
                (demo.tokens?.length || 0) > 2 ? '...' : '')) }, demo.demo)))));
};
const ComponentTokenDrawer = ({ visible, component = 'Button', onClose, theme }) => {
    const [, hashId] = useStyle();
    const { component: componentToken, global: aliasTokenNames } = getComponentToken(component) || { global: [] };
    const componentTokenData = useMemo(() => Object.keys(componentToken ?? {}), [componentToken]);
    const aliasTokenData = useMemo(() => {
        return aliasTokenNames.sort();
    }, [aliasTokenNames]);
    const handleComponentTokenChange = (token, value) => {
        theme.onThemeChange?.({
            ...theme.config,
            components: {
                ...theme.config.components,
                [component]: {
                    ...theme.config.components?.[component],
                    [token]: value,
                },
            },
        }, ['components', component, token]);
    };
    return (React.createElement(Drawer, { open: visible, title: React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
            React.createElement("span", null, `${component} 组件 Token`),
            React.createElement(Tag, { className: "previewer-component-token-drawer-theme" }, theme.name)), onClose: onClose, width: 1200, className: classNames('previewer-component-token-drawer', hashId) },
        React.createElement("div", { style: { display: 'flex', height: '100%' } },
            React.createElement(ConfigProvider, { theme: theme.config },
                React.createElement(ConfigProvider, { theme: theme.config },
                    React.createElement(ComponentFullDemos, { demos: ComponentDemos[component] }))),
            React.createElement("div", { style: { flex: '0 0 400px', overflow: 'auto', padding: 24 } },
                React.createElement("div", { className: "previewer-component-drawer-subtitle" }, "Related Tokens / \u76F8\u5173 token"),
                React.createElement(TokenCard, { icon: React.createElement(BuildOutlined, null), hideUsageCount: true, defaultOpen: true, title: "Component Token", tokenArr: componentTokenData, tokenPath: ['components', component], themes: [theme], fallback: () => componentToken, onTokenChange: (_, tokenName, value) => handleComponentTokenChange(tokenName, value), placeholder: React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: "\u6682\u65E0\u76F8\u5173 Component Token", style: {
                            marginBlock: 0,
                            paddingBlock: 32,
                        } }) }),
                React.createElement(TokenCard, { icon: React.createElement(CarOutlined, null), hideUsageCount: true, themes: [theme], defaultOpen: true, title: "Alias Token", tokenArr: aliasTokenData, tokenPath: ['components', component], fallback: (themeConfig) => getDesignToken(themeConfig), onTokenChange: (_, tokenName, value) => handleComponentTokenChange(tokenName, value), placeholder: React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: "\u6682\u65E0\u76F8\u5173 Alias Token", style: {
                            marginBlock: 0,
                            paddingBlock: 32,
                        } }) })))));
};
export default ({ ...props }) => (React.createElement(ConfigProvider, { theme: { algorithm: defaultAlgorithm } },
    React.createElement(ComponentTokenDrawer, { ...props })));
//# sourceMappingURL=ComponentTokenDrawer.js.map