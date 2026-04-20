/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect } from 'react';
import { InputNumber, Select } from 'antd';
import { connect, mapProps } from '@formily/react';
import { useAuthTranslation } from '../../locale';
const { Option } = Select;
const InputTime = connect(
  (props) => {
    const { t } = useAuthTranslation();
    const { value, onChange, minNum = 1, ...restProps } = props;
    const regex = /^(\d*)([a-zA-Z]*)$/;
    const match = value ? value.match(regex) : null;
    useEffect(() => {
      if (!match) onChange('10m');
    }, [match, onChange]);
    const [time, unit] = match ? [parseInt(match[1]), match[2]] : [10, 'm'];
    const TimeUnits = React.createElement(
      Select,
      { value: unit, onChange: (unit) => onChange(`${time}${unit}`), style: { width: 120 } },
      React.createElement(Option, { value: 'm' }, t('Minutes')),
      React.createElement(Option, { value: 'h' }, t('Hours')),
      React.createElement(Option, { value: 'd' }, t('Days')),
    );
    return React.createElement(InputNumber, {
      value: time,
      addonAfter: TimeUnits,
      min: minNum,
      onChange: (time) => onChange(`${time ?? 1}${unit}`),
      ...restProps,
    });
  },
  mapProps({
    onInput: 'onChange',
  }),
);
export const componentsNameMap = {
  InputTime: 'InputTime',
};
export const componentsMap = {
  [componentsNameMap.InputTime]: InputTime,
};
//# sourceMappingURL=components.js.map
