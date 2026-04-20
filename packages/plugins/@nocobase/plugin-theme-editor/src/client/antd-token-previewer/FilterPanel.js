/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Segmented, Tag } from 'antd';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React from 'react';
import makeStyle from './utils/makeStyle';
const useStyle = makeStyle('FilterPanel', (token) => ({
    '.previewer-filter-panel': {
        // boxShadow:
        //   '0 2px 4px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(25,15,15,0.07), 0 0 1px 0 rgba(0,0,0,0.08)',
        // backgroundColor: '#fff',
        // borderRadius: 6,
        // padding: '8px 12px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'start',
        '.component-tree-head': {
            display: 'flex',
            alignItems: 'center',
            flex: 'none',
            marginInlineEnd: 20,
            '.component-tree-filter-type': {
                color: token.colorTextSecondary,
                marginInlineEnd: token.marginXS,
                fontSize: token.fontSizeSM,
            },
            '.component-tree-filter-segmented': {
                fontSize: token.fontSizeSM,
            },
        },
        '.preview-panel-subtitle': {
            fontSize: token.fontSizeSM,
            color: token.colorTextSecondary,
        },
        [`${token.rootCls}-tag.previewer-token-filter-tag`]: {
            color: token.colorPrimary,
            backgroundColor: 'rgba(22,119,255,0.10)',
            border: 'none',
            borderRadius: 4,
            '> .anticon': {
                color: token.colorPrimary,
            },
        },
    },
}));
const FilterPanel = ({ className, filterMode: customFilterMode, onFilterModeChange, selectedTokens, onSelectedTokensChange, onTokenClick, ...rest }) => {
    const [wrapSSR, hashId] = useStyle();
    const [filterMode, setFilterMode] = useMergedState(customFilterMode || 'filter');
    if (selectedTokens.length === 0) {
        return null;
    }
    return wrapSSR(React.createElement("div", { className: classNames('previewer-filter-panel', hashId, className), ...rest }, selectedTokens && selectedTokens.length > 0 && (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "component-tree-head" },
            React.createElement("div", { className: "component-tree-filter-type" }, "\u7B5B\u9009\u65B9\u5F0F\uFF1A"),
            React.createElement(Segmented, { className: "component-tree-filter-segmented", size: "small", value: filterMode, onChange: (value) => {
                    onFilterModeChange?.(value);
                    setFilterMode(value);
                }, options: [
                    { label: '过滤', value: 'filter' },
                    { label: '高亮', value: 'highlight' },
                ] })),
        React.createElement("div", null,
            React.createElement("span", { className: "preview-panel-subtitle" }, "\u5DF2\u9009\u4E2D\uFF1A"),
            selectedTokens.map((token) => (React.createElement(Tag, { key: token, closable: true, onClose: () => onSelectedTokensChange?.(selectedTokens?.filter((item) => item !== token)), style: { marginBlock: 2, cursor: 'pointer' }, className: "previewer-token-filter-tag", onClick: () => onTokenClick?.(token) }, token))))))));
};
export default FilterPanel;
//# sourceMappingURL=FilterPanel.js.map