/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CaretRightOutlined, ExpandOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { StablePopover } from '@nocobase/client';
import { Button, Checkbox, Collapse, ConfigProvider, InputNumber, Switch, Tooltip, Typography, Input } from 'antd';
import seed from 'antd/es/theme/themes/seed';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useDebouncyFn } from 'use-debouncy';
import ColorPanel from '../ColorPanel';
import IconSwitch from '../IconSwitch';
import { themeMap } from '../hooks/useControlledTheme';
import { CompactTheme, DarkTheme, Light, Pick } from '../icons';
import { useLocale } from '../locale';
import getDesignToken from '../utils/getDesignToken';
import makeStyle from '../utils/makeStyle';
import InputNumberPlus from './InputNumberPlus';
import TokenDetail from './TokenDetail';
import TokenPreview from './TokenPreview';
import calcCustomToken from './calcCustomToken';
import tokenMeta from './token-meta.json';
const { Panel } = Collapse;
const useStyle = makeStyle('ColorTokenContent', (token) => ({
    '.token-panel-pro-color': {
        height: '100%',
        display: 'flex',
        '.token-panel-pro-color-seeds': {
            height: '100%',
            flex: 1,
            width: 0,
            borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            '.token-panel-pro-color-themes': {
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                flex: '0 0 60px',
                '> span': {
                    fontSize: token.fontSizeLG,
                    fontWeight: token.fontWeightStrong,
                },
            },
        },
        [`.token-panel-pro-token-collapse${token.rootCls}-collapse`]: {
            flex: 1,
            overflow: 'auto',
            [`> ${token.rootCls}-collapse-item-active`]: {
                backgroundColor: '#fff',
                boxShadow: '0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05), 0 12px 48px -8px rgba(0,0,0,0.03), inset 0 0 0 2px #1677FF',
                transition: 'box-shadow 0.2s ease-in-out',
                borderRadius: 8,
            },
            [`> ${token.rootCls}-collapse-item > ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
                paddingBlock: '0 12px',
            },
            '.token-panel-pro-token-collapse-description': {
                color: token.colorTextTertiary,
                marginBottom: 16,
            },
            '.token-panel-pro-token-collapse-subtitle': {
                color: token.colorTextSecondary,
                fontSize: 12,
            },
            '.token-panel-pro-token-collapse-seed-block': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                '+ .token-panel-pro-token-collapse-seed-block': {
                    marginTop: 8,
                },
                '&-name-cn': {
                    fontWeight: token.fontWeightStrong,
                    marginInlineEnd: 4,
                },
                '&-name': {
                    color: token.colorTextTertiary,
                },
                '&-sample': {
                    flex: 'none',
                    '&:not(:last-child)': {
                        marginInlineEnd: 16,
                    },
                    '&-theme': {
                        color: token.colorTextTertiary,
                        marginBottom: 2,
                        fontSize: 12,
                        textAlign: 'end',
                    },
                    '&-card': {
                        cursor: 'pointer',
                        border: `1px solid ${token.colorBorderSecondary}`,
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 8px',
                        '&-value': {
                            fontFamily: 'Monaco,'.concat(token.fontFamily),
                        },
                    },
                },
            },
            [`.token-panel-pro-token-collapse-map-collapse${token.rootCls}-collapse`]: {
                borderRadius: 4,
                backgroundColor: '#fff',
                [`> ${token.rootCls}-collapse-item`]: {
                    '&:not(:first-child)': {
                        [`> ${token.rootCls}-collapse-header`]: {
                            [`> ${token.rootCls}-collapse-header-text`]: {
                                '.token-panel-pro-token-collapse-map-collapse-preview': {
                                    '.token-panel-pro-token-collapse-map-collapse-preview-color': {
                                        marginTop: -1,
                                    },
                                },
                            },
                        },
                    },
                    [`> ${token.rootCls}-collapse-header`]: {
                        padding: { value: '0 12px 0 16px', _skip_check_: true },
                        [`> ${token.rootCls}-collapse-expand-icon`]: {
                            alignSelf: 'center',
                        },
                        [`> ${token.rootCls}-collapse-header-text`]: {
                            flex: 1,
                            '.token-panel-pro-token-collapse-map-collapse-token': {
                                color: token.colorTextSecondary,
                                marginInlineStart: 4,
                                marginInlineEnd: 8,
                            },
                            '.token-panel-pro-token-collapse-map-collapse-preview': {
                                display: 'flex',
                                flex: 'none',
                                '.token-panel-pro-token-collapse-map-collapse-preview-color': {
                                    height: 56,
                                    width: 56,
                                    position: 'relative',
                                    borderInline: '1px solid #e8e8e8',
                                },
                                '> *': {
                                    marginInlineEnd: 8,
                                },
                            },
                        },
                    },
                    [`> ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
                        padding: '0',
                    },
                },
            },
        },
        '.token-panel-pro-token-collapse-map-collapse-count': {
            color: token.colorTextSecondary,
            // display: 'inline-block',
            fontSize: 12,
            lineHeight: '16px',
            padding: '0 6px',
            backgroundColor: token.colorFillAlter,
            borderRadius: 999,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        '.token-panel-pro-token-pick': {
            transition: 'color 0.3s',
        },
        '.token-panel-pro-token-picked': {
            color: token.colorPrimary,
        },
        [`.token-panel-pro-grouped-map-collapse${token.rootCls}-collapse`]: {
            borderRadius: 4,
            [`> ${token.rootCls}-collapse-item`]: {
                [`> ${token.rootCls}-collapse-header`]: {
                    padding: '6px 12px',
                    color: token.colorIcon,
                    fontSize: 12,
                    lineHeight: token.lineHeightSM,
                    [`${token.rootCls}-collapse-expand-icon`]: {
                        lineHeight: '20px',
                        height: 20,
                    },
                },
                [`> ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
                    padding: 0,
                    [`.token-panel-pro-token-collapse-map-collapse${token.rootCls}-collapse`]: {
                        border: 'none',
                        [`${token.rootCls}-collapse-item:last-child`]: {
                            borderBottom: 'none',
                        },
                    },
                },
            },
        },
    },
}));
const getSeedValue = (config, token) => {
    // @ts-ignore
    return config.token?.[token] || seed[token] || getDesignToken(config)[token];
};
const seedRange = {
    borderRadius: {
        min: 0,
        max: 16,
    },
    fontSize: {
        min: 12,
        max: 32,
    },
    sizeStep: {
        min: 0,
        max: 16,
    },
    sizeUnit: {
        min: 0,
        max: 16,
    },
};
const SeedTokenPreview = ({ theme, tokenName, disabled, alpha }) => {
    const tokenPath = ['token', tokenName];
    const [tokenValue, setTokenValue] = useState(getSeedValue(theme.config, tokenName));
    const locale = useLocale();
    const debouncedOnChange = useDebouncyFn((newValue) => {
        theme.onThemeChange?.({
            ...theme.config,
            token: {
                ...theme.config.token,
                ...calcCustomToken(tokenName, newValue),
            },
        }, ['token', tokenName]);
    }, 500);
    const handleChange = (value) => {
        setTokenValue(value);
        debouncedOnChange(value);
    };
    useEffect(() => {
        setTokenValue(getSeedValue(theme.config, tokenName));
    }, [theme.config, tokenName]);
    const showReset = theme.getCanReset?.(tokenPath);
    return (React.createElement("div", { className: "token-panel-pro-token-collapse-seed-block-sample" },
        React.createElement("div", { className: "token-panel-pro-token-collapse-seed-block-sample-theme" },
            React.createElement(Typography.Link, { style: {
                    fontSize: 12,
                    padding: 0,
                    opacity: showReset ? 1 : 0,
                    pointerEvents: showReset ? 'auto' : 'none',
                }, onClick: () => theme.onReset?.(tokenPath) }, locale.reset)),
        tokenName.startsWith('color') && (React.createElement(StablePopover, { trigger: "click", placement: "bottomRight", overlayInnerStyle: { padding: 0 }, content: React.createElement(ColorPanel, { color: tokenValue, onChange: handleChange, style: { border: 'none' }, alpha: alpha }) },
            React.createElement("div", { className: "token-panel-pro-token-collapse-seed-block-sample-card", style: { pointerEvents: disabled ? 'none' : 'auto' } },
                React.createElement("div", { style: {
                        backgroundColor: tokenValue,
                        width: 48,
                        height: 32,
                        borderRadius: 4,
                        marginRight: 14,
                        boxShadow: '0 2px 3px -1px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.09)',
                    } }),
                React.createElement("div", { className: "token-panel-pro-token-collapse-seed-block-sample-card-value" }, tokenValue)))),
        ['fontSize', 'sizeUnit', 'sizeStep', 'borderRadius'].includes(tokenName) && (React.createElement(InputNumberPlus, { value: tokenValue, onChange: handleChange, min: seedRange[tokenName].min, max: seedRange[tokenName].max })),
        tokenName === 'wireframe' && React.createElement(Switch, { checked: tokenValue, onChange: handleChange }),
        ['siderWidth'].includes(tokenName) && (React.createElement(InputNumber, { defaultValue: 200, value: tokenValue, onChange: handleChange })),
        ['globalStyle'].includes(tokenName) && (React.createElement(Input.TextArea, { value: tokenValue, onChange: (e) => {
                handleChange(e.target.value);
            } }))));
};
const MapTokenCollapseContent = ({ mapTokens, theme, onTokenSelect, selectedTokens, type, }) => {
    const locale = useLocale();
    return (React.createElement(Collapse, { className: "token-panel-pro-token-collapse-map-collapse" }, mapTokens?.map((mapToken) => (React.createElement(Panel, { header: React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
            React.createElement("div", { style: {
                    flex: 1,
                    whiteSpace: 'nowrap',
                    width: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 8,
                } },
                locale._lang === 'zh-CN' && (React.createElement("span", { style: { fontWeight: 500, flex: 'none' } }, tokenMeta[mapToken]?.name)),
                React.createElement("span", { className: "token-panel-pro-token-collapse-map-collapse-token", style: { flex: 'none' } }, mapToken),
                React.createElement("span", { className: "token-panel-pro-token-collapse-map-collapse-count" }, getDesignToken(theme.config)[mapToken])),
            React.createElement("div", { className: "token-panel-pro-token-collapse-map-collapse-preview" },
                React.createElement("div", { className: "token-panel-pro-token-collapse-map-collapse-preview-color" },
                    React.createElement(TokenPreview, { theme: theme.config, tokenName: mapToken, type: type }))),
            React.createElement("div", { style: { flex: 'none', margin: 4 }, onClick: (e) => {
                    e.stopPropagation();
                    onTokenSelect?.(mapToken, 'map');
                } },
                React.createElement(Pick, { className: classNames('token-panel-pro-token-pick', {
                        'token-panel-pro-token-picked': selectedTokens?.map?.includes(mapToken),
                    }) }))), key: mapToken },
        React.createElement(TokenDetail, { style: { margin: 8 }, themes: [theme], path: ['token'], tokenName: mapToken }))))));
};
const MapTokenCollapse = ({ theme, onTokenSelect, selectedTokens, groupFn, group }) => {
    const locale = useLocale();
    const groupedTokens = useMemo(() => {
        const grouped = {};
        if (groupFn) {
            group.mapToken?.forEach((token) => {
                const key = groupFn(token) ?? 'default';
                grouped[key] = [...(grouped[key] ?? []), token];
            });
        }
        return grouped;
    }, [group, groupFn]);
    if (groupFn) {
        return (React.createElement(Collapse, { className: "token-panel-pro-grouped-map-collapse", defaultActiveKey: Object.keys(groupedTokens), expandIconPosition: "end", expandIcon: ({ isActive }) => React.createElement(CaretRightOutlined, { rotate: isActive ? 450 : 360, style: { fontSize: 12 } }) }, (group.mapTokenGroups ?? Object.keys(groupedTokens)).map((key) => (React.createElement(Panel, { key: key, header: locale[key] ?? '' },
            React.createElement(MapTokenCollapseContent, { mapTokens: groupedTokens[key], theme: theme, selectedTokens: selectedTokens, onTokenSelect: onTokenSelect, type: group.type }))))));
    }
    if (group.groups) {
        return (React.createElement(Collapse, { className: "token-panel-pro-grouped-map-collapse", defaultActiveKey: group.groups.map((item) => item.key), expandIconPosition: "end", expandIcon: ({ isActive }) => React.createElement(CaretRightOutlined, { rotate: isActive ? 450 : 360, style: { fontSize: 12 } }) }, group.groups.map((item) => (React.createElement(Panel, { key: item.key, header: item.name },
            React.createElement(MapTokenCollapseContent, { mapTokens: item.mapToken, theme: theme, selectedTokens: selectedTokens, onTokenSelect: onTokenSelect, type: item.type }))))));
    }
    return (React.createElement(MapTokenCollapseContent, { mapTokens: group.mapToken ?? [], theme: theme, selectedTokens: selectedTokens, onTokenSelect: onTokenSelect, type: group.type }));
};
const groupMapToken = (token) => {
    if (token.startsWith('colorFill')) {
        return 'fill';
    }
    if (token.startsWith('colorBorder') || token.startsWith('colorSplit')) {
        return 'border';
    }
    if (token.startsWith('colorBg')) {
        return 'background';
    }
    if (token.startsWith('colorText')) {
        return 'text';
    }
    return '';
};
const TokenContent = ({ category, theme, selectedTokens, onTokenSelect, infoFollowPrimary, onInfoFollowPrimaryChange, activeGroup, onActiveGroupChange, }) => {
    const [wrapSSR, hashId] = useStyle();
    const [grouped, setGrouped] = useState(true);
    const locale = useLocale();
    const switchAlgorithm = (themeStr) => () => {
        let newAlgorithm = theme.config.algorithm;
        if (!newAlgorithm) {
            newAlgorithm = themeMap[themeStr];
        }
        else if (Array.isArray(newAlgorithm)) {
            newAlgorithm = newAlgorithm.includes(themeMap[themeStr])
                ? newAlgorithm.filter((item) => item !== themeMap[themeStr])
                : [...newAlgorithm, themeMap[themeStr]];
        }
        else {
            newAlgorithm = newAlgorithm === themeMap[themeStr] ? undefined : [newAlgorithm, themeMap[themeStr]];
        }
        theme.onThemeChange?.({ ...theme.config, algorithm: newAlgorithm }, ['config', 'algorithm']);
    };
    const isLeftChecked = (str) => {
        if (!theme.config.algorithm) {
            return true;
        }
        return Array.isArray(theme.config.algorithm)
            ? !theme.config.algorithm.includes(themeMap[str])
            : theme.config.algorithm !== themeMap[str];
    };
    return wrapSSR(React.createElement("div", { className: classNames(hashId, 'token-panel-pro-color') },
        React.createElement("div", { className: "token-panel-pro-color-seeds" },
            React.createElement("div", { className: "token-panel-pro-color-themes" },
                React.createElement("span", { style: { marginRight: 12 } }, locale._lang === 'zh-CN' ? category.name : category.nameEn),
                category.nameEn === 'Color' && (React.createElement(IconSwitch, { onChange: switchAlgorithm('dark'), leftChecked: isLeftChecked('dark'), leftIcon: React.createElement(Light, null), rightIcon: React.createElement(DarkTheme, null), style: { marginLeft: 'auto' } })),
                category.nameEn === 'Size' && (React.createElement(IconSwitch, { onChange: switchAlgorithm('compact'), leftChecked: isLeftChecked('compact'), leftIcon: React.createElement(ExpandOutlined, null), rightIcon: React.createElement(CompactTheme, null), style: { marginLeft: 'auto' } }))),
            React.createElement(ConfigProvider, { theme: {
                    token: {
                        colorBorder: '#f0f0f0',
                    },
                } },
                React.createElement(Collapse, { className: "token-panel-pro-token-collapse", expandIconPosition: "end", ghost: true, accordion: true, activeKey: activeGroup, expandIcon: ({ isActive }) => React.createElement(CaretRightOutlined, { rotate: isActive ? 450 : 360, style: { fontSize: 12 } }), onChange: (key) => {
                        onActiveGroupChange(key);
                    } }, category.groups.map((group, index) => {
                    return (React.createElement(Panel, { header: React.createElement("span", { style: { fontWeight: 500 } }, locale._lang === 'zh-CN' ? group.name : group.nameEn), key: group.key },
                        React.createElement("div", null,
                            React.createElement("div", { className: "token-panel-pro-token-collapse-description" }, locale._lang === 'zh-CN' ? group.desc : group.descEn),
                            group.seedToken?.map((seedToken) => (React.createElement("div", { key: seedToken, className: "token-panel-pro-token-collapse-seed-block" },
                                React.createElement("div", { style: { marginRight: 'auto' } },
                                    React.createElement("div", { className: "token-panel-pro-token-collapse-subtitle" },
                                        React.createElement("span", { style: { fontSize: 12 } }, "Seed Token"),
                                        React.createElement(Tooltip, { placement: "topLeft", arrowPointAtCenter: true, title: locale._lang === 'zh-CN'
                                                ? tokenMeta[seedToken]?.desc
                                                : tokenMeta[seedToken]?.descEn },
                                            React.createElement(QuestionCircleOutlined, { style: { fontSize: 14, marginLeft: 8 } }))),
                                    React.createElement("div", null,
                                        React.createElement("span", { className: "token-panel-pro-token-collapse-seed-block-name-cn" }, locale._lang === 'zh-CN'
                                            ? tokenMeta[seedToken]?.name
                                            : tokenMeta[seedToken]?.nameEn),
                                        seedToken === 'colorInfo' && (React.createElement(Checkbox, { style: { marginLeft: 12 }, checked: infoFollowPrimary, onChange: (e) => onInfoFollowPrimaryChange?.(e.target.checked) }, locale.followPrimary)))),
                                React.createElement(SeedTokenPreview, { alpha: !!group.seedTokenAlpha, theme: theme, tokenName: seedToken, disabled: seedToken === 'colorInfo' && infoFollowPrimary })))),
                            (group.mapToken || group.groups) && (React.createElement("div", { style: { marginTop: 16, marginBottom: 24 } },
                                React.createElement("div", { className: "token-panel-pro-token-collapse-subtitle", style: {
                                        marginBottom: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                    } },
                                    React.createElement("span", null, "Map Token"),
                                    React.createElement(Tooltip, { placement: "topLeft", arrowPointAtCenter: true, title: "\u68AF\u5EA6\u53D8\u91CF\uFF08Map Token\uFF09 \u662F\u57FA\u4E8E Seed \u6D3E\u751F\u7684\u68AF\u5EA6\u53D8\u91CF\uFF0C\u6211\u4EEC\u7CBE\u5FC3\u8BBE\u8BA1\u7684\u68AF\u5EA6\u53D8\u91CF\u6A21\u578B\u5177\u6709\u826F\u597D\u7684\u89C6\u89C9\u8BBE\u8BA1\u8BED\u4E49\uFF0C\u53EF\u5728\u4EAE\u6697\u8272\u6A21\u5F0F\u5207\u6362\u65F6\u4FDD\u8BC1\u89C6\u89C9\u68AF\u5EA6\u7684\u4E00\u81F4\u6027\u3002" },
                                        React.createElement(QuestionCircleOutlined, { style: { fontSize: 14, marginLeft: 8 } })),
                                    group.mapTokenGroups && (React.createElement("div", { style: {
                                            marginLeft: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                        } },
                                        React.createElement("label", { style: { marginRight: 4 } }, locale.groupView),
                                        React.createElement(Switch, { checked: grouped, onChange: (v) => setGrouped(v), size: "small" })))),
                                React.createElement(MapTokenCollapse, { group: group, theme: theme, selectedTokens: selectedTokens, onTokenSelect: onTokenSelect, groupFn: group.mapTokenGroups && grouped ? groupMapToken : undefined }))),
                            index < category.groups.length - 1 && (React.createElement(Button, { type: "primary", style: { borderRadius: 4, marginBottom: 12 }, onClick: () => onActiveGroupChange(category.groups[index + 1]?.key) }, locale.next)))));
                }))))));
};
export default TokenContent;
//# sourceMappingURL=TokenContent.js.map