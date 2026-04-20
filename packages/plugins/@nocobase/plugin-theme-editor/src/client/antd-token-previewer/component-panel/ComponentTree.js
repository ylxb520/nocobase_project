/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SearchOutlined } from '@ant-design/icons';
import { Badge, Input, Tree } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import makeStyle from '../utils/makeStyle';
import { getRelatedComponents } from '../utils/statistic';
const { DirectoryTree } = Tree;
const useStyle = makeStyle('ComponentTree', (token) => ({
    '.component-tree-wrapper': {
        minWidth: 200,
        borderInlineEnd: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingBlock: token.paddingXS,
        '.component-tree-search': {
            margin: '0 8px 12px',
            width: 'calc(100% - 16px)',
            backgroundColor: 'rgba(0, 0, 0, 2%)',
            borderRadius: token.borderRadiusLG,
            height: 24,
            input: {
                fontSize: 12,
            },
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 4%)',
            },
        },
        [`${token.rootCls}-tree.component-tree`]: {
            fontSize: token.fontSizeSM,
            '.component-tree-item.component-tree-item-highlight': {
                color: token.colorPrimary,
            },
            [`${token.rootCls}-tree-node-content-wrapper`]: {
                transition: `background-color ${token.motionDurationSlow}`,
                borderRadius: 4,
            },
            [`${token.rootCls}-tree-treenode-selected ${token.rootCls}-tree-node-content-wrapper`]: {
                color: token.colorTextLightSolid,
                '.component-tree-item.component-tree-item-highlight': {
                    color: token.colorTextLightSolid,
                },
            },
            '.component-tree-item': {
                transition: `color ${token.motionDurationMid}`,
                lineHeight: `24px`,
                height: 24,
                display: 'inline-block',
            },
        },
    },
}));
const getTreeItemId = (component) => `component-tree-item-${component}`;
const ComponentTree = ({ onSelect, components, selectedTokens, filterMode = 'filter', activeComponent, }) => {
    const [wrapSSR, hashId] = useStyle();
    const treeRef = useRef(null);
    const [search, setSearch] = useState('');
    const relatedComponents = useMemo(() => {
        return selectedTokens ? getRelatedComponents(selectedTokens) : [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTokens]);
    useEffect(() => {
        treeRef.current?.querySelector(`#${getTreeItemId(activeComponent || '')}`)?.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
        });
    }, [activeComponent]);
    const treeData = useMemo(() => Object.entries(components)
        .filter(([, group]) => (filterMode === 'highlight' ||
        !relatedComponents.length ||
        group.some((item) => relatedComponents.includes(item))) &&
        (!search || group.some((item) => item.toLowerCase().includes(search.toLowerCase()))))
        .map(([type, group]) => ({
        title: type,
        key: `type-${type}`,
        children: group
            .filter((item) => (filterMode === 'highlight' || !relatedComponents.length || relatedComponents.includes(item)) &&
            (!search || item.toLowerCase().includes(search.toLowerCase())))
            .map((item) => ({
            title: (React.createElement("span", { id: getTreeItemId(item), className: classNames('component-tree-item', {
                    'component-tree-item-highlight': filterMode === 'highlight' && relatedComponents.includes(item),
                }) }, item)),
            switcherIcon: () => (React.createElement(Badge, { color: filterMode === 'highlight' && relatedComponents.includes(item)
                    ? activeComponent === item
                        ? 'white'
                        : 'blue'
                    : 'transparent' })),
            key: item,
        })),
    })), [components, relatedComponents, filterMode, search, activeComponent]);
    useEffect(() => {
        if (filterMode === 'highlight') {
            setTimeout(() => {
                treeRef.current?.getElementsByClassName('component-tree-item-active')[0]?.scrollIntoView({
                    block: 'start',
                    inline: 'nearest',
                    behavior: 'smooth',
                });
            }, 100);
        }
    }, [selectedTokens, filterMode]);
    return wrapSSR(React.createElement("div", { className: classNames('component-tree-wrapper', hashId) },
        React.createElement(Input, { allowClear: true, placeholder: "Type to search", value: search, onChange: (e) => setSearch(e.target.value), prefix: React.createElement(SearchOutlined, null), bordered: false, className: "component-tree-search" }),
        React.createElement("div", { ref: treeRef, style: { overflow: 'auto', flex: 1 } },
            React.createElement(DirectoryTree, { selectedKeys: [activeComponent ?? ''], showIcon: false, defaultExpandAll: true, treeData: treeData, className: "component-tree", onSelect: (node) => onSelect?.(node[0]), expandAction: "doubleClick" }))));
};
export default ComponentTree;
//# sourceMappingURL=ComponentTree.js.map