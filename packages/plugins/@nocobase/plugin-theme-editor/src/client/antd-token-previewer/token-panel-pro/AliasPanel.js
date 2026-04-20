/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CaretRightOutlined, QuestionCircleOutlined, RightOutlined, ShrinkOutlined } from '@ant-design/icons';
import { Button, Collapse, Empty, Tooltip } from 'antd';
import classNames from 'classnames';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React, { useMemo } from 'react';
import { Pick } from '../icons';
import { mapRelatedAlias, seedRelatedAlias } from '../meta/TokenRelation';
import makeStyle from '../utils/makeStyle';
import { getRelatedComponents } from '../utils/statistic';
import TokenDetail from './TokenDetail';
const { Panel } = Collapse;
const useStyle = makeStyle('TokenPanelProAlias', (token) => ({
    '.token-panel-pro-color-alias': {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 45,
        borderTop: `1px solid ${token.colorSplit}`,
        '.token-panel-pro-color-alias-title': {
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            flex: '0 0 60px',
            '&-text': {
                fontSize: token.fontSizeLG,
                fontWeight: token.fontWeightStrong,
            },
        },
        '.token-panel-pro-color-alias-description': {
            color: token.colorTextTertiary,
            fontSize: token.fontSizeSM,
            lineHeight: token.lineHeightSM,
            padding: '0 16px 12px',
        },
        [`.token-panel-pro-alias-collapse${token.rootCls}-collapse`]: {
            [`> ${token.rootCls}-collapse-item > ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
                paddingBlock: '0',
            },
            [`> ${token.rootCls}-collapse-item`]: {
                [`> ${token.rootCls}-collapse-header`]: {
                    alignItems: 'center',
                    padding: '8px 16px',
                    [`> ${token.rootCls}-collapse-header-text`]: {
                        flex: 1,
                        '.token-panel-pro-token-collapse-map-collapse-count': {
                            color: token.colorTextSecondary,
                            display: 'inline-block',
                            fontSize: 12,
                            lineHeight: '16px',
                            padding: '0 6px',
                            backgroundColor: token.colorFillAlter,
                            borderRadius: 999,
                        },
                    },
                    '.token-panel-pro-token-picked': {
                        color: token.colorPrimary,
                    },
                },
            },
        },
        '.token-panel-pro-color-alias-expand': {
            height: '100%',
            width: 20,
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
                '.token-panel-pro-color-alias-expand-handler': {
                    opacity: 1,
                },
            },
            '.token-panel-pro-color-alias-expand-handler': {
                height: 100,
                width: 16,
                borderRadius: 999,
                border: `1px solid ${token.colorSplit}`,
                backgroundColor: '#fff',
                margin: 'auto',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'box-shadow 0.2s',
                '&:hover': {
                    boxShadow: token.boxShadow,
                },
            },
        },
    },
}));
const AliasPanel = ({ className, activeSeeds, theme, style, selectedTokens, onTokenSelect, open: customOpen, onOpenChange, description, }) => {
    const [wrapSSR, hashId] = useStyle();
    const [open, setOpen] = useMergedState(customOpen ?? true, {
        value: customOpen,
        onChange: onOpenChange,
    });
    const shownAlias = useMemo(() => selectedTokens?.map?.length
        ? Array.from(new Set(selectedTokens?.map.reduce((result, map) => {
            return result.concat(...(mapRelatedAlias[map] ?? []));
        }, [])))
        : activeSeeds?.reduce((result, item) => result.concat(seedRelatedAlias[item] ?? []), []), [selectedTokens, activeSeeds]);
    return wrapSSR(React.createElement("div", { className: classNames(className, 'token-panel-pro-color-alias', hashId), style: style }, open ? (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "token-panel-pro-color-alias-title" },
            React.createElement("span", { className: "token-panel-pro-color-alias-title-text" }, "Alias Token"),
            React.createElement(Tooltip, { placement: "topLeft", arrowPointAtCenter: true, title: "\u522B\u540D\u53D8\u91CF\uFF08Alias Token\uFF09\u662F Map Token \u7684\u522B\u540D\u3002Alias Token \u7528\u4E8E\u6279\u91CF\u63A7\u5236\u67D0\u4E9B\u5171\u6027\u7EC4\u4EF6\u7684\u6837\u5F0F\u3002" },
                React.createElement(QuestionCircleOutlined, { style: { fontSize: 14, marginLeft: 4 } })),
            React.createElement(Button, { type: "text", icon: React.createElement(ShrinkOutlined, null), style: { marginLeft: 'auto' }, onClick: () => setOpen(false) })),
        description && React.createElement("div", { className: "token-panel-pro-color-alias-description" }, description),
        React.createElement("div", { style: { flex: 1, overflow: 'auto' } },
            React.createElement(Collapse, { className: "token-panel-pro-alias-collapse", ghost: true, expandIcon: ({ isActive }) => React.createElement(CaretRightOutlined, { rotate: isActive ? 90 : 0, style: { fontSize: 12 } }) }, shownAlias?.map((aliasToken) => (React.createElement(Panel, { header: React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement("span", { style: { marginRight: 8 } }, aliasToken),
                    React.createElement("span", { className: "token-panel-pro-token-collapse-map-collapse-count" }, getRelatedComponents(aliasToken).length),
                    React.createElement("div", { style: { padding: 4, marginLeft: 'auto' }, onClick: (e) => {
                            e.stopPropagation();
                            onTokenSelect?.(aliasToken, 'alias');
                        } },
                        React.createElement(Pick, { className: classNames('token-panel-pro-token-pick', {
                                'token-panel-pro-token-picked': selectedTokens?.alias?.includes(aliasToken),
                            }) }))), key: aliasToken },
                React.createElement(TokenDetail, { style: { paddingBottom: 10 }, themes: [theme], path: ['token'], tokenName: aliasToken }))))),
            !shownAlias?.length && React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: "\u6682\u65E0\u76F8\u5173 Alias Token" })))) : (React.createElement("div", { className: "token-panel-pro-color-alias-expand" },
        React.createElement("div", { className: "token-panel-pro-color-alias-expand-handler", onClick: () => setOpen(true) },
            React.createElement(RightOutlined, { style: { fontSize: 12 } }))))));
};
export default AliasPanel;
//# sourceMappingURL=AliasPanel.js.map