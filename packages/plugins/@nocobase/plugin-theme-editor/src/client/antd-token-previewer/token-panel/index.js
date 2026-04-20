/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CheckOutlined } from '@ant-design/icons';
import { Dropdown, Input, Menu, Switch, theme as antdTheme } from 'antd';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { SearchDropdown } from '../icons';
import { TOKEN_SORTS, classifyToken, getTypeOfToken } from '../utils/classifyToken';
import getDesignToken from '../utils/getDesignToken';
import makeStyle from '../utils/makeStyle';
import TokenCard, { IconMap, TextMap } from './token-card';
import { getTokenItemId } from './token-item';
const { useToken } = antdTheme;
const useStyle = makeStyle('AliasTokenPreview', (token) => ({
    '.preview-panel-wrapper': {
        overflow: 'auto',
        height: '100%',
        '.preview-panel': {
            height: '100%',
            minWidth: 300,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            '.preview-panel-token-wrapper': {
                position: 'relative',
                flex: 1,
                overflow: 'hidden',
                '&::before, &::after': {
                    position: 'absolute',
                    zIndex: 1,
                    opacity: 0,
                    transition: 'opacity .3s',
                    content: '""',
                    pointerEvents: 'none',
                    insetInlineStart: 0,
                    insetInlineEnd: 0,
                    height: 40,
                },
                '&::before': {
                    top: 0,
                    boxShadow: 'inset 0 10px 8px -8px #00000014',
                },
                '&::after': {
                    bottom: 0,
                    boxShadow: 'inset 0 -10px 8px -8px #00000014',
                },
                '&.preview-panel-token-wrapper-ping-top': {
                    '&::before': {
                        opacity: 1,
                    },
                },
            },
            '.preview-panel-space': {
                marginBottom: 20,
                paddingInlineStart: token.paddingXS,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '.preview-hide-token': {
                    color: token.colorTextSecondary,
                    fontSize: token.fontSizeSM,
                    lineHeight: token.lineHeightSM,
                    display: 'flex',
                    alignItems: 'center',
                    '>*:first-child': {
                        marginInlineEnd: 2,
                    },
                },
            },
            '.preview-panel-search': {
                backgroundColor: 'rgba(0, 0, 0, 2%)',
                borderRadius: token.borderRadiusLG,
                [`${token.rootCls}-input-group-addon`]: {
                    backgroundColor: 'inherit',
                    border: 'none',
                    padding: 0,
                    transition: `background-color ${token.motionDurationSlow}`,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 4%)',
                    },
                },
                input: {
                    fontSize: token.fontSizeSM,
                    paddingInlineStart: 4,
                },
                '.previewer-token-type-dropdown-icon-active': {
                    color: token.colorPrimary,
                },
            },
        },
    },
}));
export default forwardRef((props, ref) => {
    const { filterTypes, onFilterTypesChange, themes, selectedTokens, onTokenSelect, enableTokenSelect } = props;
    const [wrapSSR, hashId] = useStyle();
    const [search, setSearch] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [showTokenListShadowTop, setShowTokenListShadowTop] = useState(false);
    const cardWrapperRef = useRef(null);
    const [activeCards, setActiveCards] = useState([]);
    const [activeToken, setActiveToken] = useState();
    const { token } = useToken();
    const [mergedFilterTypes, setMergedFilterTypes] = useMergedState(filterTypes || []);
    // TODO: Split AliasToken and SeedToken
    const groupedToken = useMemo(() => classifyToken(token), [token]);
    useEffect(() => {
        const handleTokenListScroll = () => {
            setShowTokenListShadowTop((cardWrapperRef.current?.scrollTop ?? 0) > 0);
        };
        cardWrapperRef.current?.addEventListener('scroll', handleTokenListScroll);
        const wrapper = cardWrapperRef.current;
        return () => {
            wrapper?.removeEventListener('scroll', handleTokenListScroll);
        };
    }, []);
    useImperativeHandle(ref, () => ({
        scrollToToken: (tokenName) => {
            const type = getTypeOfToken(tokenName);
            if (!activeCards.includes(type)) {
                setActiveCards((prev) => [...prev, type]);
            }
            setActiveToken(tokenName);
            setTimeout(() => {
                const node = cardWrapperRef.current?.querySelector(`#${getTokenItemId(tokenName)}`);
                if (!node) {
                    return;
                }
                node?.scrollIntoView({
                    block: 'center',
                    inline: 'nearest',
                });
            }, 100);
        },
    }));
    const handleAliasTokenChange = (theme, tokenName, value) => {
        theme.onThemeChange?.({
            ...theme.config,
            token: {
                ...theme.config.token,
                [tokenName]: value,
            },
        }, ['token', tokenName]);
    };
    return wrapSSR(React.createElement("div", { className: classNames('preview-panel-wrapper', hashId) },
        React.createElement("div", { className: classNames('preview-panel') },
            React.createElement("div", { style: { padding: 16 } },
                React.createElement("h3", { className: classNames('preview-panel-space', hashId) },
                    React.createElement("span", null, "Alias Token \u9884\u89C8"),
                    React.createElement("span", { className: "preview-hide-token" },
                        React.createElement("span", null, "\u663E\u793A\u6240\u6709"),
                        React.createElement(Switch, { checked: showAll, onChange: (value) => setShowAll(value), size: "small" }))),
                React.createElement(Input, { allowClear: true, onChange: (e) => {
                        setSearch(e.target.value);
                    }, bordered: false, addonBefore: React.createElement(React.Fragment, null,
                        React.createElement(Dropdown, { overlay: React.createElement(Menu, { items: [
                                    {
                                        label: '筛选项',
                                        type: 'group',
                                        key: 'title-key',
                                        style: { fontSize: 12 },
                                    },
                                    ...TOKEN_SORTS.map((type) => ({
                                        icon: (React.createElement("span", null,
                                            React.createElement(CheckOutlined, { style: {
                                                    opacity: mergedFilterTypes.includes(type) ? 1 : 0,
                                                    marginInlineEnd: 8,
                                                    fontSize: 12,
                                                } }),
                                            IconMap[type])),
                                        label: TextMap[type],
                                        key: type,
                                        onClick: () => {
                                            const newTypes = mergedFilterTypes.includes(type)
                                                ? mergedFilterTypes.filter((item) => type !== item)
                                                : [...mergedFilterTypes, type];
                                            setMergedFilterTypes(newTypes);
                                            onFilterTypesChange?.(newTypes);
                                        },
                                    })),
                                ] }), trigger: ['click'] },
                            React.createElement(SearchDropdown, { style: {
                                    width: 32,
                                    cursor: 'pointer',
                                    fontSize: 18,
                                    paddingTop: 2,
                                    transition: 'color 0.3s',
                                }, className: classNames({
                                    'previewer-token-type-dropdown-icon-active': mergedFilterTypes.length > 0,
                                }) }))), className: "preview-panel-search", placeholder: "\u641C\u7D22 Token / \u8272\u503C / \u6587\u672C / \u5706\u89D2\u7B49" })),
            React.createElement("div", { className: classNames('preview-panel-token-wrapper', {
                    'preview-panel-token-wrapper-ping-top': showTokenListShadowTop,
                }) },
                React.createElement("div", { ref: cardWrapperRef, style: { height: '100%', overflow: 'auto', padding: '0 16px' } },
                    React.createElement("div", null, TOKEN_SORTS.filter((type) => type !== 'seed' &&
                        (mergedFilterTypes.includes(type) || mergedFilterTypes.length === 0) &&
                        (!search || groupedToken[type].some((item) => item.toLowerCase().includes(search.toLowerCase())))).map((key) => (React.createElement(TokenCard, { title: TextMap[key], icon: IconMap[key], key: key, tokenPath: ['token'], tokenArr: groupedToken[key], keyword: search, hideUseless: !showAll, open: activeCards.includes(key), onOpenChange: (open) => setActiveCards((prev) => (open ? [...prev, key] : prev.filter((item) => item !== key))), onTokenChange: handleAliasTokenChange, activeToken: activeToken, onActiveTokenChange: (tokenName) => setActiveToken(tokenName), themes: themes, selectedTokens: selectedTokens, onTokenSelect: onTokenSelect, enableTokenSelect: enableTokenSelect, fallback: (config) => getDesignToken(config) })))))))));
});
//# sourceMappingURL=index.js.map