/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ConfigProvider, Tooltip } from 'antd';
import classNames from 'classnames';
import React from 'react';
import ComponentDemos from '../component-demos';
import { useLocale } from '../locale';
import makeStyle from '../utils/makeStyle';
import ComponentCard, { getComponentDemoId } from './ComponentCard';
const useStyle = makeStyle('ComponentDemoGroup', (token) => ({
    '.previewer-component-demo-group': {
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
        '&:first-child': {
            '.previewer-component-demo-group-item': {
                paddingTop: token.padding,
            },
        },
        '&:last-child': {
            '.previewer-component-demo-group-item': {
                paddingBottom: token.padding,
            },
        },
    },
}));
const useDemoStyle = makeStyle('ComponentDemoBlock', (token) => ({
    '.previewer-component-demo-group-item': {
        flex: '1 1 50%',
        paddingInline: token.padding,
        paddingBlock: token.padding / 2,
        width: 0,
        backgroundColor: token.colorBgLayout,
        '.previewer-component-demo-group-item-relative-token': {
            color: token.colorTextSecondary,
            paddingBottom: 8,
            '&:not(:first-child)': {
                marginTop: 12,
            },
        },
    },
}));
const ComponentDemoBlock = ({ component, onTokenClick, size = 'middle', disabled = false, demos = [], theme, componentDrawer, }) => {
    const [, hashId] = useDemoStyle();
    const locale = useLocale();
    return (React.createElement("div", { className: classNames('previewer-component-demo-group-item', hashId) },
        React.createElement(ComponentCard, { title: component, component: component, onTokenClick: onTokenClick, drawer: componentDrawer, theme: theme },
            React.createElement(ConfigProvider, { componentSize: size, componentDisabled: disabled }, demos.some((item) => item.active)
                ? demos.map((demo) => (React.createElement("div", { key: demo.key, style: { display: demo.active ? '' : 'none' } },
                    demo.tokens && (React.createElement("div", { className: "previewer-component-demo-group-item-relative-token" },
                        React.createElement(Tooltip, { title: demo.tokens.join(', ') },
                            React.createElement("span", null,
                                locale.relatedTokens,
                                ": ",
                                demo.tokens.slice(0, 2).join(', '),
                                demo.tokens.length > 2 ? '...' : '')))),
                    demo.demo)))
                : demos[0]?.demo))));
};
const ComponentDemoGroup = ({ themes, components, size, disabled, activeComponents, selectedTokens, onTokenClick, componentDrawer, hideTokens, }) => {
    const [wrapSSR, hashId] = useStyle();
    return wrapSSR(React.createElement(React.Fragment, null, Object.entries(components)
        .reduce((result, [, group]) => result.concat(group), [])
        .map((item) => {
        const componentDemos = ComponentDemos[item];
        if (!componentDemos) {
            return null;
        }
        const demos = componentDemos.map((demo, index) => {
            return {
                ...demo,
                tokens: hideTokens ? undefined : demo.tokens,
                active: ((!selectedTokens || selectedTokens.length === 0) && index === 0) ||
                    selectedTokens?.some((token) => demo.tokens?.includes(token)),
            };
        });
        return (React.createElement("div", { className: classNames('previewer-component-demo-group', hashId), key: item, id: getComponentDemoId(item), style: {
                display: !activeComponents || activeComponents.length === 0 || activeComponents.includes(item) ? '' : 'none',
            } }, themes.length > 1 ? (themes.map((theme) => (React.createElement(ConfigProvider, { key: theme.key, theme: theme.config },
            React.createElement(ComponentDemoBlock, { component: item, onTokenClick: onTokenClick, demos: demos, disabled: disabled, size: size, theme: theme, componentDrawer: componentDrawer }))))) : (React.createElement(ComponentDemoBlock, { component: item, onTokenClick: onTokenClick, demos: demos, disabled: disabled, size: size, theme: themes[0], componentDrawer: componentDrawer }))));
    })));
};
export default ComponentDemoGroup;
//# sourceMappingURL=ComponentDemoGroup.js.map