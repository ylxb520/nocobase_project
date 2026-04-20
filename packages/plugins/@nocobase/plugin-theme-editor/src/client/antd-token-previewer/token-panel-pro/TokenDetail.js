/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import TokenInput from '../TokenInput';
import { useLocale } from '../locale';
import { mapRelatedAlias } from '../meta/TokenRelation';
import deepUpdateObj from '../utils/deepUpdateObj';
import getDesignToken from '../utils/getDesignToken';
import getValueByPath from '../utils/getValueByPath';
import makeStyle from '../utils/makeStyle';
import { getRelatedComponents } from '../utils/statistic';
import tokenMeta from './token-meta.json';
const useStyle = makeStyle('TokenDetail', (token) => ({
    '.token-panel-token-detail': {
        '.token-panel-pro-token-collapse-map-collapse-token-description': {
            color: token.colorTextPlaceholder,
            marginBottom: 8,
            fontSize: 12,
        },
        '.token-panel-pro-token-collapse-map-collapse-token-usage-tag-container': {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            color: token.colorTextSecondary,
        },
        '.token-panel-pro-token-collapse-map-collapse-token-usage-tag': {
            display: 'inline-block',
            marginInlineEnd: 8,
            borderRadius: 4,
            height: 20,
            padding: '0 8px',
            fontSize: 12,
            lineHeight: '20px',
            backgroundColor: 'rgba(0,0,0,0.015)',
        },
        '.token-panel-pro-token-collapse-map-collapse-token-inputs': {
            padding: '8px 10px',
            backgroundColor: 'rgba(0,0,0,0.02)',
            marginTop: 12,
            '> *:not(:last-child)': {
                marginBottom: 8,
            },
        },
    },
}));
const TokenDetail = ({ themes, path, tokenName, className, style }) => {
    const [wrapSSR, hashId] = useStyle();
    const tokenPath = [...path, tokenName];
    const locale = useLocale();
    const handleTokenChange = (theme) => (value) => {
        theme.onThemeChange?.(deepUpdateObj(theme.config, [...path, tokenName], value), [...path, tokenName]);
    };
    const relatedComponents = useMemo(() => {
        return getRelatedComponents([tokenName, ...(mapRelatedAlias[tokenName] ?? [])]);
    }, [tokenName]);
    return wrapSSR(React.createElement("div", { className: classNames(className, hashId, 'token-panel-token-detail'), style: style },
        React.createElement("div", { className: "token-panel-pro-token-collapse-map-collapse-token-description" }, tokenMeta[tokenName]?.[locale._lang === 'zh-CN' ? 'desc' : 'descEn']),
        relatedComponents.length > 0 && (React.createElement(Tooltip, { title: getRelatedComponents(tokenName).join(', '), placement: "topLeft" },
            React.createElement("div", { className: "token-panel-pro-token-collapse-map-collapse-token-usage-tag-container" }, relatedComponents.map((item) => (React.createElement("span", { key: item, className: "token-panel-pro-token-collapse-map-collapse-token-usage-tag" }, item)))))),
        React.createElement("div", { className: "token-panel-pro-token-collapse-map-collapse-token-inputs" }, themes.map((themeItem) => {
            return (React.createElement("div", { key: themeItem.key },
                React.createElement(TokenInput, { hideTheme: themes.length === 1, theme: themeItem, canReset: themeItem.getCanReset?.(tokenPath), onReset: () => themeItem.onReset?.(tokenPath), onChange: handleTokenChange(themeItem), value: getValueByPath(themeItem.config, tokenPath) ?? getDesignToken(themeItem.config)[tokenName] })));
        }))));
};
export default TokenDetail;
//# sourceMappingURL=TokenDetail.js.map