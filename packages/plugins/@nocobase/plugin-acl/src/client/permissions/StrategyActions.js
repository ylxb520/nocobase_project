/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { connect, useField } from '@formily/react';
import { Checkbox, Select, Table, Tag } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCompile } from '@nocobase/client';
import { useAvailableActions } from './AvailableActions';
const toScopes = (value) => {
  if (!value) {
    return {};
  }
  const scopes = {};
  value?.forEach?.((item) => {
    const [name, scope] = item.split(':');
    scopes[name] = scope || 'all';
  });
  return scopes;
};
const toFieldValue = (scopes) => {
  const values = [];
  for (const name in scopes) {
    if (Object.prototype.hasOwnProperty.call(scopes, name)) {
      const scope = scopes[name];
      if (scope === 'all') {
        values.push(name);
      } else {
        values.push(`${name}:${scope}`);
      }
    }
  }
  return values;
};
export const StrategyActions = connect((props) => {
  const { onChange } = props;
  const availableActions = useAvailableActions();
  const compile = useCompile();
  const { t } = useTranslation();
  const field = useField();
  const scopes = toScopes(field.value);
  return React.createElement(
    'div',
    null,
    React.createElement(Table, {
      rowKey: 'name',
      size: 'small',
      pagination: false,
      columns: [
        {
          dataIndex: 'displayName',
          title: t('Action display name'),
          render: (value) => compile(value),
        },
        {
          dataIndex: 'onNewRecord',
          title: t('Action type'),
          render: (onNewRecord) =>
            onNewRecord
              ? React.createElement(Tag, { color: 'green' }, t('Action on new records'))
              : React.createElement(Tag, { color: 'geekblue' }, t('Action on existing records')),
        },
        {
          dataIndex: 'enabled',
          title: t('Allow'),
          render: (enabled, action) =>
            React.createElement(Checkbox, {
              checked: enabled,
              'aria-label': `${action.name}_checkbox`,
              onChange: (e) => {
                if (enabled) {
                  delete scopes[action.name];
                } else {
                  scopes[action.name] = 'all';
                }
                onChange(toFieldValue(scopes));
              },
            }),
        },
        {
          dataIndex: 'scope',
          title: t('Data scope'),
          render: (scope, action) =>
            !action.onNewRecord &&
            React.createElement(Select, {
              'data-testid': 'select-data-scope',
              popupMatchSelectWidth: false,
              size: 'small',
              value: scope,
              options: [
                { label: t('All records'), value: 'all' },
                { label: t('Own records'), value: 'own' },
              ],
              onChange: (value) => {
                scopes[action.name] = value;
                onChange(toFieldValue(scopes));
              },
            }),
        },
      ],
      dataSource: availableActions?.map((item) => {
        let scope = 'all';
        let enabled = false;
        if (scopes[item.name]) {
          enabled = true;
          scope = scopes[item.name];
        }
        return {
          ...item,
          enabled,
          scope,
        };
      }),
    }),
  );
});
//# sourceMappingURL=StrategyActions.js.map
