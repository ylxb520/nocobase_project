/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Flex, Form, Input, InputNumber, Switch } from 'antd';
import { useFlowContext } from '@nocobase/flow-engine';
import { CollectionCascader } from '../basic';
export const CollectionSetting = ({ form, onCollectionCascaderChange, name, show, disableCollectionCascader }) => {
  const ctx = useFlowContext();
  const validateMessages = {
    required: ctx.t('defaults.form.required'),
  };
  return React.createElement(
    Form,
    {
      form: form,
      name: name,
      initialValues: {
        description: '',
        enabled: true,
        limit: 1000,
      },
      validateMessages: validateMessages,
      layout: 'vertical',
      colon: true,
      style: !show && { display: 'none' },
    },
    React.createElement(
      Form.Item,
      {
        label: ctx.t('Title'),
        name: 'title',
        rules: [
          {
            required: true,
          },
        ],
      },
      React.createElement(Input, null),
    ),
    React.createElement(
      Form.Item,
      {
        label: ctx.t('Collection'),
        name: 'collection',
        rules: [
          {
            required: true,
          },
        ],
      },
      React.createElement(CollectionCascader, {
        onChange: onCollectionCascaderChange,
        disabled: disableCollectionCascader === true,
      }),
    ),
    React.createElement(
      Form.Item,
      { label: ctx.t('Description'), name: 'description' },
      React.createElement(Input.TextArea, { rows: 5 }),
    ),
    React.createElement(
      Flex,
      { justify: 'space-between', align: 'center' },
      React.createElement(
        Form.Item,
        {
          required: false,
          label: ctx.t('Limit'),
          name: 'limit',
          rules: [
            {
              required: true,
            },
          ],
          layout: 'horizontal',
        },
        React.createElement(InputNumber, { min: 1, max: 20000, step: 100, changeOnWheel: true }),
      ),
      React.createElement(
        Form.Item,
        {
          required: false,
          label: ctx.t('Enabled'),
          name: 'enabled',
          rules: [
            {
              required: true,
            },
          ],
          layout: 'horizontal',
        },
        React.createElement(Switch, null),
      ),
    ),
  );
};
//# sourceMappingURL=CollectionSetting.js.map
