/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Avatar, List } from 'antd';
import React from 'react';
const data = [
    { title: 'Ant Design Title 1' },
    { title: 'Ant Design Title 2' },
    { title: 'Ant Design Title 3' },
    { title: 'Ant Design Title 4' },
];
const Demo = () => (React.createElement(List, { itemLayout: "horizontal", dataSource: data, renderItem: (item) => (React.createElement(List.Item, null,
        React.createElement(List.Item.Meta, { avatar: React.createElement(Avatar, { src: "https://joeschmoe.io/api/v1/random" }), title: React.createElement("a", { href: "https://ant.design" }, item.title), description: "Ant Design, a design language for background applications, is refined by Ant UED Team" }))) }));
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: [],
    key: 'default',
};
export default componentDemo;
//# sourceMappingURL=list.js.map