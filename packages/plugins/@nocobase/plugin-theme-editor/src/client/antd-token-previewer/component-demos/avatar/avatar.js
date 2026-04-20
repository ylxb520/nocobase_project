/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import React from 'react';
export default () => (React.createElement(Space, { direction: "vertical" },
    React.createElement(Space, null,
        React.createElement(Avatar, { size: 64, icon: React.createElement(UserOutlined, null) }),
        React.createElement(Avatar, { size: "large", icon: React.createElement(UserOutlined, null) }),
        React.createElement(Avatar, { icon: React.createElement(UserOutlined, null) }),
        React.createElement(Avatar, { size: "small", icon: React.createElement(UserOutlined, null) })),
    React.createElement(Space, null,
        React.createElement(Avatar, { shape: "square", size: 64, icon: React.createElement(UserOutlined, null) }),
        React.createElement(Avatar, { shape: "square", size: "large", icon: React.createElement(UserOutlined, null) }),
        React.createElement(Avatar, { shape: "square", icon: React.createElement(UserOutlined, null) }),
        React.createElement(Avatar, { shape: "square", size: "small", icon: React.createElement(UserOutlined, null) }))));
//# sourceMappingURL=avatar.js.map