/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormLayout } from '@formily/antd-v5';
import { Form, Radio, Tooltip } from 'antd';
import React from 'react';
import { css, FormItem } from '@nocobase/client';
import { useLang } from '../../locale';
function parseMode(v) {
    if (!v) {
        return 'single';
    }
    if (v >= 1) {
        return 'all';
    }
    if (v <= -1) {
        return 'any';
    }
    const dir = Math.sign(v);
    if (dir > 0) {
        return '';
    }
}
export function ModeConfig({ value, onChange }) {
    const mode = parseMode(value);
    const negotiationFieldset = (React.createElement("fieldset", null,
        React.createElement(FormLayout, { layout: "vertical" },
            React.createElement(FormItem, { label: useLang('Negotiation') },
                React.createElement(Radio.Group, { value: value, onChange: onChange },
                    React.createElement(Radio, { value: 1 },
                        React.createElement(Tooltip, { title: useLang('Everyone should pass'), placement: "bottom" },
                            React.createElement("span", null, useLang('All pass')),
                            React.createElement(QuestionCircleOutlined, { style: { color: '#999' } }))),
                    React.createElement(Radio, { value: -1 },
                        React.createElement(Tooltip, { title: useLang('Anyone pass'), placement: "bottom" },
                            React.createElement("span", null, useLang('Any pass')),
                            React.createElement(QuestionCircleOutlined, { style: { color: '#999' } }))))))));
    return (React.createElement("fieldset", { className: css `
        .ant-radio-group {
          .anticon {
            margin-left: 0.5em;
          }
        }
      ` },
        React.createElement(Form.Item, null,
            React.createElement(Radio.Group, { value: Boolean(value), onChange: ({ target: { value: v } }) => {
                    console.log(v);
                    onChange(Number(v));
                } },
                React.createElement(Radio, { value: true },
                    React.createElement(Tooltip, { title: useLang('Each user has own task'), placement: "bottom" },
                        React.createElement("span", null, useLang('Separately')),
                        React.createElement(QuestionCircleOutlined, { style: { color: '#999' } }))),
                React.createElement(Radio, { value: false },
                    React.createElement(Tooltip, { title: useLang('Everyone shares one task'), placement: "bottom" },
                        React.createElement("span", null, useLang('Collaboratively')),
                        React.createElement(QuestionCircleOutlined, { style: { color: '#999' } }))))),
        value ? negotiationFieldset : null));
}
//# sourceMappingURL=ModeConfig.js.map