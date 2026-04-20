/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css } from '@nocobase/client';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useWorkflowTranslation } from '../../locale';
import { OnField } from './OnField';
export function EndsByField({ value, onChange }) {
    const { t } = useWorkflowTranslation();
    const type = value != null ? (typeof value === 'object' && !(value instanceof Date) ? 'field' : 'date') : null;
    return (React.createElement("fieldset", { className: css `
        display: flex;
        gap: 0.5em;
      ` },
        React.createElement(Select, { value: type, onChange: (t) => {
                onChange(t ? (t === 'field' ? {} : new Date()) : null);
            }, className: "auto-width" },
            React.createElement(Select.Option, { value: null }, t('No end')),
            React.createElement(Select.Option, { value: 'field' }, t('By field')),
            React.createElement(Select.Option, { value: 'date' }, t('By custom date'))),
        type === 'field' ? React.createElement(OnField, { value: value, onChange: onChange }) : null,
        type === 'date' ? (React.createElement(DatePicker, { showTime: true, value: dayjs(value), onChange: (v) => {
                onChange(v ? v.toDate() : null);
            } })) : null));
}
//# sourceMappingURL=EndsByField.js.map