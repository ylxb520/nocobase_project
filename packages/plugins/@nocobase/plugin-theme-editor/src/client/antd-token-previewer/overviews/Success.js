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
import Alert from '../component-demos/alert/success';
import Input from '../component-demos/input/success';
import Message from '../component-demos/message/success';
import Notification from '../component-demos/notification/success';
import Progress from '../component-demos/progress/success';
import Result from '../component-demos/result/success';
import Tag from '../component-demos/tag/success';
import Timeline from '../component-demos/timeline/success';
import { Flexbox } from '@arvinxu/layout-kit';
export const Success = () => {
    return (React.createElement(Card, { size: 'small' },
        React.createElement(Flexbox, { horizontal: true, align: 'start', gap: 24 },
            React.createElement(Flexbox, { gap: 40 },
                React.createElement(Flexbox, { horizontal: true, align: 'center', gap: 12 },
                    React.createElement("div", null, Tag.demo),
                    Input.demo),
                Alert.demo),
            React.createElement(Flexbox, { align: 'center', gap: 28 },
                Message.demo,
                Progress.demo)),
        React.createElement(Flexbox, { horizontal: true, gap: 40, style: { marginTop: 32 } },
            React.createElement("div", null, Notification.demo),
            React.createElement("div", null, Timeline.demo)),
        Result.demo));
};
//# sourceMappingURL=Success.js.map