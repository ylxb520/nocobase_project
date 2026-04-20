/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Transfer } from 'antd';
import React, { useState } from 'react';
const mockData = [];
for (let i = 0; i < 20; i++) {
    mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
    });
}
const initialTargetKeys = mockData.filter((item) => +item.key > 10).map((item) => item.key);
const Demo = () => {
    const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const onScroll = () => { };
    return (React.createElement(Transfer, { dataSource: mockData, titles: ['Source', 'Target'], targetKeys: targetKeys, status: 'warning', selectedKeys: selectedKeys, onChange: (nextTargetKeys) => {
            setTargetKeys(nextTargetKeys);
        }, onSelectChange: (sourceSelectedKeys, targetSelectedKeys) => {
            setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
        }, onScroll: onScroll, render: (item) => item.title }));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorWarning'],
    key: 'warning',
};
export default componentDemo;
//# sourceMappingURL=warning.js.map