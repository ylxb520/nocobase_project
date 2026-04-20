/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { useFlowSettingsContext } from '@nocobase/flow-engine';
import { Form, Space, Cascader, Select, Input, Checkbox, Button, InputNumber } from 'antd';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined } from '@ant-design/icons';
import { useT } from '../../locale';
import { useDataSourceManager, useCompile } from '@nocobase/client';
import {
  getFieldOptions,
  getCollectionOptions,
  getFormatterOptionsByField,
  buildOrderFieldOptions,
} from './QueryBuilder.service';
import { appendColon, debugLog } from '../utils';
import AntdFilterSelector from '../components/AntdFilterSelector';
export const QueryBuilder = React.forwardRef(({ initialValues, onChange }, ref) => {
  const t = useT();
  const [form] = Form.useForm();
  const ctx = useFlowSettingsContext();
  const lang = ctx?.i18n?.language;
  React.useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));
  // 从内表单读取 collectionPath，驱动字段树
  const collectionPath = Form.useWatch('collectionPath', form);
  // 构建集合选项（改为 service 纯函数）
  const dm = useDataSourceManager();
  const compile = useCompile();
  const collectionOptions = React.useMemo(() => getCollectionOptions(dm, compile), [dm, compile]);
  const fieldOptions = React.useMemo(() => getFieldOptions(dm, compile, collectionPath), [dm, compile, collectionPath]);
  const measuresValue = Form.useWatch('measures', form);
  const dimensionsValue = Form.useWatch('dimensions', form);
  const orderFieldOptions = React.useMemo(() => buildOrderFieldOptions(fieldOptions, dimensionsValue, measuresValue), [
    dimensionsValue,
    measuresValue,
    fieldOptions,
  ]);
  // 切换集合后，清理依赖旧集合的字段配置
  const onCollectionChange = (val) => {
    form.setFieldsValue({
      collectionPath: val,
      measures: [],
      dimensions: [],
      orders: [],
      filter: undefined,
    });
    onChange?.(form.getFieldsValue(true));
  };
  const handleValuesChange = (_, allValues) => {
    debugLog('---handleValuesChange', allValues);
    onChange?.(allValues);
  };
  // 工具：数组上移/下移
  const moveItem = (name, index, dir) => {
    const arr = form.getFieldValue(name) || [];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    const next = arr.slice();
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    form.setFieldsValue({ [name]: next });
    onChange?.({ ...(form.getFieldsValue(true) || {}), [name]: next });
  };
  return React.createElement(
    'div',
    { style: { paddingTop: 8 } },
    React.createElement(
      Form,
      { form: form, layout: 'vertical', initialValues: initialValues, onValuesChange: handleValuesChange },
      React.createElement(
        Form.Item,
        {
          name: 'collectionPath',
          label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t('Collection'), lang)),
          rules: [{ required: true }],
        },
        React.createElement(Cascader, {
          showSearch: true,
          placeholder: t('Collection'),
          options: collectionOptions,
          onChange: onCollectionChange,
          style: { width: 222 },
        }),
      ),
      React.createElement('div', { style: { fontWeight: 500, marginBottom: 8 } }, appendColon(t('Measures'), lang)),
      React.createElement(
        'div',
        { style: { marginBottom: 16 } },
        React.createElement(Form.List, { name: 'measures' }, (fields, { add, remove }) =>
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { style: { overflow: 'auto' } },
              fields.map((field, idx) =>
                React.createElement(
                  Space,
                  { align: 'center', size: [8, 4], wrap: false, style: { marginBottom: 8 }, key: field.key },
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'field'], style: { marginBottom: 0 } },
                    React.createElement(Cascader, {
                      style: { minWidth: 114 },
                      placeholder: t('Select Field'),
                      fieldNames: { label: 'title', value: 'name', children: 'children' },
                      options: fieldOptions,
                    }),
                  ),
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'aggregation'], style: { marginBottom: 0 } },
                    React.createElement(Select, {
                      style: { minWidth: 75 },
                      placeholder: t('Aggregation'),
                      options: [
                        { label: t('Sum'), value: 'sum' },
                        { label: t('Count'), value: 'count' },
                        { label: t('Avg'), value: 'avg' },
                        { label: t('Max'), value: 'max' },
                        { label: t('Min'), value: 'min' },
                      ],
                    }),
                  ),
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'alias'], style: { marginBottom: 0 } },
                    React.createElement(Input, { style: { minWidth: 75 }, placeholder: t('Alias') }),
                  ),
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'distinct'], valuePropName: 'checked', style: { marginBottom: 0 } },
                    React.createElement(Checkbox, { style: { minWidth: 60 } }, t('Distinct')),
                  ),
                  React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    onClick: () => remove(field.name),
                    icon: React.createElement(DeleteOutlined, null),
                  }),
                  fields.length > 1 &&
                    React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(Button, {
                        size: 'small',
                        type: 'text',
                        disabled: idx === 0,
                        onClick: () => moveItem('measures', idx, -1),
                        icon: React.createElement(ArrowUpOutlined, null),
                      }),
                      React.createElement(Button, {
                        size: 'small',
                        type: 'text',
                        disabled: idx === fields.length - 1,
                        onClick: () => moveItem('measures', idx, 1),
                        icon: React.createElement(ArrowDownOutlined, null),
                      }),
                    ),
                ),
              ),
            ),
            React.createElement(
              Button,
              {
                type: 'link',
                icon: React.createElement(PlusOutlined, null),
                onClick: () => add({}),
                style: { marginTop: -8, padding: 0 },
              },
              t('Add field'),
            ),
          ),
        ),
      ),
      React.createElement('div', { style: { fontWeight: 500, marginBottom: 8 } }, appendColon(t('Dimensions'), lang)),
      React.createElement(
        'div',
        { style: { marginBottom: 16 } },
        React.createElement(Form.List, { name: 'dimensions' }, (fields, { add, remove }) =>
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { style: { overflow: 'auto' } },
              fields.map((field, idx) => {
                const fieldName = field.name;
                const dimField = form.getFieldValue(['dimensions', fieldName, 'field']);
                const fmtOptions = getFormatterOptionsByField(dm, collectionPath, dimField);
                return React.createElement(
                  Space,
                  { align: 'center', size: [8, 4], wrap: false, style: { marginBottom: 8 }, key: field.key },
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'field'], style: { marginBottom: 0 } },
                    React.createElement(Cascader, {
                      style: { minWidth: 114 },
                      placeholder: t('Select Field'),
                      fieldNames: { label: 'title', value: 'name', children: 'children' },
                      options: fieldOptions,
                    }),
                  ),
                  fmtOptions?.length
                    ? React.createElement(
                        Form.Item,
                        { name: [field.name, 'format'], style: { marginBottom: 0 } },
                        React.createElement(Select, {
                          placeholder: t('Format'),
                          popupMatchSelectWidth: false,
                          options: fmtOptions.map((o) => ({ label: o.label, value: o.value })),
                        }),
                      )
                    : null,
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'alias'], style: { marginBottom: 0 } },
                    React.createElement(Input, { style: { minWidth: 75 }, placeholder: t('Alias') }),
                  ),
                  React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    onClick: () => remove(field.name),
                    icon: React.createElement(DeleteOutlined, null),
                  }),
                  React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    disabled: idx === 0,
                    onClick: () => moveItem('dimensions', idx, -1),
                    icon: React.createElement(ArrowUpOutlined, null),
                  }),
                  React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    disabled: idx === fields.length - 1,
                    onClick: () => moveItem('dimensions', idx, 1),
                    icon: React.createElement(ArrowDownOutlined, null),
                  }),
                );
              }),
            ),
            React.createElement(
              Button,
              {
                type: 'link',
                icon: React.createElement(PlusOutlined, null),
                onClick: () => add({}),
                style: { marginTop: -8, padding: 0 },
              },
              t('Add field'),
            ),
          ),
        ),
      ),
      React.createElement('div', { style: { fontWeight: 500, marginBottom: 8 } }, appendColon(t('Filter'), lang)),
      React.createElement(
        'div',
        { style: { marginBottom: 16 } },
        React.createElement(
          Form.Item,
          { name: 'filter', style: { overflow: 'auto' } },
          React.createElement(AntdFilterSelector, { model: ctx.model, collectionPath: collectionPath }),
        ),
      ),
      React.createElement('div', { style: { fontWeight: 500, marginBottom: 4 } }, appendColon(t('Sort'), lang)),
      React.createElement(
        'div',
        { style: { marginBottom: 16 } },
        React.createElement(Form.List, { name: 'orders' }, (fields, { add, remove }) =>
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { style: { overflow: 'auto' } },
              fields.map((field, idx) =>
                React.createElement(
                  Space,
                  { wrap: true, align: 'center', size: [8, 4], style: { marginBottom: 8 }, key: field.key },
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'field'], style: { marginBottom: 0 } },
                    React.createElement(Cascader, {
                      placeholder: t('Select Field'),
                      fieldNames: { label: 'title', value: 'name', children: 'children' },
                      options: orderFieldOptions,
                      style: { minWidth: 114 },
                    }),
                  ),
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'order'], style: { marginBottom: 0 } },
                    React.createElement(Select, {
                      defaultValue: 'ASC',
                      style: { minWidth: 100 },
                      options: [
                        { label: 'ASC', value: 'ASC' },
                        { label: 'DESC', value: 'DESC' },
                      ],
                    }),
                  ),
                  React.createElement(
                    Form.Item,
                    { name: [field.name, 'nulls'], style: { marginBottom: 0 } },
                    React.createElement(Select, {
                      defaultValue: 'default',
                      style: { minWidth: 110 },
                      options: [
                        { label: t('Default'), value: 'default' },
                        { label: t('NULLS first'), value: 'first' },
                        { label: t('NULLS last'), value: 'last' },
                      ],
                    }),
                  ),
                  React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    onClick: () => remove(field.name),
                    icon: React.createElement(DeleteOutlined, null),
                  }),
                  React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    disabled: idx === 0,
                    onClick: () => moveItem('orders', idx, -1),
                    icon: React.createElement(ArrowUpOutlined, null),
                  }),
                  React.createElement(Button, {
                    size: 'small',
                    type: 'text',
                    disabled: idx === fields.length - 1,
                    onClick: () => moveItem('orders', idx, 1),
                    icon: React.createElement(ArrowDownOutlined, null),
                  }),
                ),
              ),
            ),
            React.createElement(
              Button,
              {
                type: 'link',
                icon: React.createElement(PlusOutlined, null),
                onClick: () => add({}),
                style: { marginTop: -8, padding: 0 },
              },
              t('Add field'),
            ),
          ),
        ),
      ),
      React.createElement(
        Form.Item,
        {
          name: 'limit',
          label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t('Limit'), lang)),
        },
        React.createElement(InputNumber, { min: 0, style: { width: 120 } }),
      ),
      React.createElement(
        Form.Item,
        {
          name: 'offset',
          label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t('Offset'), lang)),
        },
        React.createElement(InputNumber, { min: 0, style: { width: 120 } }),
      ),
    ),
  );
});
//# sourceMappingURL=QueryBuilder.js.map
