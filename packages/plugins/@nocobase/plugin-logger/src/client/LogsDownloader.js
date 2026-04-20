/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useAPIClient, useRequest } from '@nocobase/client';
import React, { useCallback, useMemo } from 'react';
import { Tree, Card, Alert, Typography, Input, Button, theme, Empty } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { useLoggerTranslation } from './locale';
import { useMemoizedFn } from 'ahooks';
const { Paragraph, Text } = Typography;
const Tips = React.memo(() => {
    const { t } = useLoggerTranslation();
    return (React.createElement(Typography, null,
        React.createElement(Paragraph, null,
            React.createElement(Text, { code: true }, "request_*.log"),
            " - ",
            t('API request and response logs')),
        React.createElement(Paragraph, null,
            React.createElement(Text, { code: true }, "system_*.log"),
            " -",
            ' ',
            t('Application, database, plugins and other system logs, the error level logs will be sent to'),
            ' ',
            React.createElement(Text, { code: true }, "system_error_*.log")),
        React.createElement(Paragraph, null,
            React.createElement(Text, { code: true }, "sql_*.log"),
            " - ",
            t('SQL execution logs, printed by Sequelize when the db logging is enabled'))));
});
Tips.displayName = 'Tips';
export const LogsDownloader = React.memo((props) => {
    const { token } = theme.useToken();
    const { t: lang } = useLoggerTranslation();
    const t = useMemoizedFn(lang);
    const api = useAPIClient();
    const [expandedKeys, setExpandedKeys] = React.useState(['0']);
    const [searchValue, setSearchValue] = React.useState('');
    const [autoExpandParent, setAutoExpandParent] = React.useState(true);
    const [checkedKeys, setCheckedKeys] = React.useState([]);
    const { data } = useRequest(() => api
        .resource('logger')
        .list()
        .then((res) => res.data?.data));
    const data2tree = useCallback((data, parent) => data.map((log, index) => {
        const key = `${parent}-${index}`;
        if (typeof log === 'string') {
            return {
                title: log,
                key,
                icon: React.createElement(FileOutlined, null),
            };
        }
        return {
            title: log.name,
            key,
            icon: React.createElement(FolderOutlined, null),
            children: data2tree(log.files, key),
        };
    }), []);
    const defaultTree = useMemo(() => {
        const files = data || [];
        return [
            {
                title: t('All'),
                key: '0',
                children: data2tree(files, '0'),
            },
        ];
    }, [data, data2tree, t]);
    const onExpand = (newExpandedKeys) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };
    const onSearch = (e) => {
        const { value } = e.target;
        const search = (data) => {
            return data.reduce((acc, node) => {
                if (node.title?.includes(value)) {
                    acc.push(node);
                }
                if (node.children) {
                    return [...acc, ...search(node.children)];
                }
                return acc;
            }, []);
        };
        const newExpandedKeys = search(defaultTree).map((node) => node.key);
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
        setCheckedKeys([]);
    };
    const tree = React.useMemo(() => {
        if (!searchValue) {
            return defaultTree;
        }
        const match = (data) => {
            const matched = [];
            for (const node of data) {
                const nodeTitle = node.title;
                const index = nodeTitle.indexOf(searchValue);
                const beforeStr = nodeTitle.substring(0, index);
                const afterStr = nodeTitle.substring(index + searchValue.length);
                const title = index > -1 ? (React.createElement("span", null,
                    beforeStr,
                    React.createElement("span", { style: { color: token.colorPrimary } }, searchValue),
                    afterStr)) : (React.createElement("span", null, nodeTitle));
                if (index > -1) {
                    matched.push({ ...node, title });
                }
                else if (node.children) {
                    const children = match(node.children);
                    if (children.length) {
                        matched.push({ ...node, title, children });
                    }
                }
            }
            return matched;
        };
        return match(defaultTree);
    }, [searchValue, defaultTree, token.colorPrimary]);
    const Download = () => {
        const getValues = (data, parent) => {
            return data.reduce((acc, node) => {
                let title = node.title;
                title = node.key === '0' ? title : `${parent}/${title}`;
                if (node.children) {
                    return [...acc, ...getValues(node.children, node.key === '0' ? '' : title)];
                }
                else if (checkedKeys.includes(node.key) && node.key !== '0') {
                    acc.push(title);
                }
                return acc;
            }, []);
        };
        const files = getValues(defaultTree, '');
        if (!files.length) {
            return;
        }
        api
            .request({
            url: 'logger:download',
            method: 'post',
            responseType: 'blob',
            data: {
                files,
            },
        })
            .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/gzip' }));
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'logs.tar.gz');
            link.click();
            link.remove();
        })
            .catch((err) => {
            console.log(err);
        });
    };
    return (React.createElement(Card, { style: { minHeight: '700px' } },
        React.createElement(Alert, { message: '', description: React.createElement(Tips, null), type: "info", showIcon: true }),
        React.createElement(Input.Search, { style: { marginTop: 16, width: '450px' }, placeholder: t('Search'), onChange: onSearch }),
        React.createElement("div", { style: {
                maxHeight: '400px',
                width: '450px',
                overflow: 'auto',
                border: '1px solid',
                marginTop: '6px',
                marginBottom: '10px',
                borderColor: token.colorBorder,
            } }, tree.length ? (React.createElement(Tree, { checkable: true, showIcon: true, showLine: true, checkedKeys: checkedKeys, expandedKeys: expandedKeys, autoExpandParent: autoExpandParent, onExpand: onExpand, onCheck: (keys) => setCheckedKeys(keys), treeData: tree })) : (React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }))),
        React.createElement(Button, { type: "primary", onClick: Download },
            t('Download'),
            " (.tar.gz)")));
});
LogsDownloader.displayName = 'LogsDownloader';
//# sourceMappingURL=LogsDownloader.js.map