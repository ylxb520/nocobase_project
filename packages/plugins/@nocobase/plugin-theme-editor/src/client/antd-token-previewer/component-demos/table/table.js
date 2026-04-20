/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Space, Table, Tag } from 'antd';
import React from 'react';
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => React.createElement("a", null, text),
    },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (tags) => (React.createElement(React.Fragment, null, tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
                color = 'volcano';
            }
            return (React.createElement(Tag, { color: color, key: tag }, tag.toUpperCase()));
        }))),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (React.createElement(Space, { size: "middle" },
            React.createElement("a", null,
                "Invite ",
                record.name),
            " ",
            React.createElement("a", null, "Delete"))),
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];
const Demo = () => React.createElement(Table, { columns: columns, dataSource: data, pagination: false });
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorPrimaryActive', 'colorBgContainer'],
    key: 'table',
};
export default componentDemo;
//# sourceMappingURL=table.js.map