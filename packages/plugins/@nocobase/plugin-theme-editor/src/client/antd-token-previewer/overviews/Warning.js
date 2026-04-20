/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Card } from 'antd';
import React from 'react';
import Alert from '../component-demos/alert/warning';
import Badge from '../component-demos/badge/warning';
import Input from '../component-demos/input/warning';
import Message from '../component-demos/message/warning';
import Modal from '../component-demos/modal/warning';
import Notification from '../component-demos/notification/warning';
import Popconfirm from '../component-demos/popconfirm/popconfirm';
import Result from '../component-demos/result/warning';
import Tag from '../component-demos/tag/warning';
import Text from '../component-demos/typography/warningText';
import Title from '../component-demos/typography/warningTitle';
import { Flexbox } from '@arvinxu/layout-kit';
export const Warning = () => {
    return (React.createElement(Card, { size: 'small' },
        React.createElement(Flexbox, { horizontal: true, align: 'start', gap: 24 },
            React.createElement(Flexbox, { gap: 24 },
                React.createElement(Flexbox, { horizontal: true, gap: 12 },
                    React.createElement("div", { style: { width: 200 } }, Title.demo),
                    React.createElement("div", { style: { width: '100%' } }, Input.demo)),
                Alert.demo),
            React.createElement(Flexbox, { align: 'center', gap: 28 },
                Message.demo,
                Popconfirm.demo,
                React.createElement(Flexbox, { horizontal: true, gap: 16 },
                    Badge.demo,
                    Tag.demo,
                    Text.demo))),
        React.createElement(Flexbox, { horizontal: true, gap: 24, style: { marginTop: 32 } },
            React.createElement("div", null, Notification.demo),
            React.createElement("div", null, Modal.demo)),
        Result.demo));
};
//# sourceMappingURL=Warning.js.map