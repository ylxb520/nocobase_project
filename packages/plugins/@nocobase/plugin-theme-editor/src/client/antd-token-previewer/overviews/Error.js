/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Flexbox } from '@arvinxu/layout-kit';
import { Card } from 'antd';
import React from 'react';
import Alert from '../component-demos/alert/error';
import Badge from '../component-demos/badge/badge';
import Button from '../component-demos/button/dangerButton';
import Dropdown from '../component-demos/dropdown/dropdownError';
import Menu from '../component-demos/menu/menuDanger';
import Message from '../component-demos/message/error';
import Notification from '../component-demos/notification/error';
import Progress from '../component-demos/progress/danger';
import Tag from '../component-demos/tag/error';
import Timeline from '../component-demos/timeline/danger';
import Upload from '../component-demos/upload/danger';
export const Error = () => {
    return (React.createElement(Card, { size: 'small' },
        React.createElement(Flexbox, { horizontal: true, align: 'start', gap: 24 },
            React.createElement(Flexbox, { gap: 24 },
                React.createElement(Flexbox, { horizontal: true, align: 'center', gap: 12, style: { marginTop: 8 } },
                    Button.demo,
                    React.createElement("div", null, Tag.demo),
                    Badge.demo),
                Alert.demo),
            React.createElement(Flexbox, { align: 'center', gap: 28 },
                Message.demo,
                Progress.demo)),
        React.createElement(Flexbox, { horizontal: true, gap: 40, style: { marginTop: 32 } },
            React.createElement("div", null, Notification.demo),
            React.createElement("div", null, Timeline.demo)),
        React.createElement(Flexbox, { horizontal: true, gap: 40 },
            Menu.demo,
            React.createElement("div", { style: { width: 300 } }, Upload.demo),
            Dropdown.demo)));
};
//# sourceMappingURL=Error.js.map