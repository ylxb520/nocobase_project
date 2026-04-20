/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState } from 'react';
import { Button, Divider, Flex, Form, Space, Steps } from 'antd';
import { observable, useFlowContext } from '@nocobase/flow-engine';
import { CollectionSetting, FieldsSetting, FilterSetting, Preview, SortSetting } from './form-steps';
import { CollectionContext, CurrentCollection } from '../context';
const dataScope = observable({
  logic: '$and',
  items: [],
});
export const DatasourceSettingForm = () => {
  const ctx = useFlowContext();
  const { Header, Footer } = ctx.view;
  const [collectionForm] = Form.useForm();
  const [fieldsForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [sortForm] = Form.useForm();
  const [previewForm] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const [collection, setCollection] = useState(null);
  const getCurrentForm = () => {
    switch (current) {
      case 0:
        return collectionForm;
      case 1:
        return fieldsForm;
      case 2:
        return filterForm;
      case 3:
        return sortForm;
      case 4:
        return previewForm;
      default:
        throw new Error('Invalid step');
    }
  };
  const next = async () => {
    try {
      const form = getCurrentForm();
      await form.validateFields();
      form.submit();
      setCurrent(current + 1);
    } catch (error) {
      console.debug('Validation failed:', error);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = [
    {
      title: ctx.t('Collection'),
    },
    {
      title: ctx.t('Fields'),
    },
    {
      title: ctx.t('Filter'),
    },
    {
      title: ctx.t('Sort'),
    },
    {
      title: ctx.t('Preview'),
    },
  ];
  const onCollectionCascaderChange = (value) => {
    if (!value) {
      return;
    }
    const [dataSourceKey, collectionName] = value;
    setCollection(ctx.dataSourceManager.getCollection(dataSourceKey, collectionName));
    dataScope.items = [];
    fieldsForm.setFieldValue('fields', []);
  };
  const onFormFinish = (name, { values }) => {
    setFormData((prev) => ({ ...prev, ...values }));
    if (name === 'collectionSetting') {
      if (values.collection) {
        const [datasource, collectionName] = values.collection;
        setFormData((prev) => ({ ...prev, datasource, collectionName }));
      }
    } else if (name === 'filterSetting') {
      setFormData((prev) => ({ ...prev, filter: dataScope }));
    }
  };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      CollectionContext.Provider,
      { value: new CurrentCollection(collection) },
      React.createElement(Header, { title: ctx.t('Add datasource') }),
      React.createElement(
        Space,
        { direction: 'vertical', size: 'small', style: { width: '100%' } },
        React.createElement(Steps, { current: current, items: items, size: 'small' }),
        React.createElement(Divider, { dashed: true }),
        React.createElement(
          Form.Provider,
          { onFormFinish: onFormFinish },
          React.createElement(CollectionSetting, {
            form: collectionForm,
            onCollectionCascaderChange: onCollectionCascaderChange,
            name: 'collectionSetting',
            show: current === 0,
          }),
          React.createElement(FieldsSetting, { form: fieldsForm, name: 'fieldsSetting', show: current === 1 }),
          React.createElement(FilterSetting, {
            form: filterForm,
            dataScope: dataScope,
            name: 'filterSetting',
            show: current === 2,
          }),
          React.createElement(SortSetting, { form: sortForm, name: 'sortSetting', show: current === 3 }),
        ),
        React.createElement(Preview, { formData: formData, show: current === 4 }),
      ),
      React.createElement(
        Footer,
        null,
        React.createElement(
          Flex,
          { justify: 'flex-end', align: 'end' },
          React.createElement(
            Space,
            null,
            React.createElement(
              Button,
              { style: { margin: '0 8px' }, onClick: () => prev(), disabled: current === 0 },
              ctx.t('Previous'),
            ),
            current < items.length - 1 &&
              React.createElement(Button, { type: 'primary', onClick: () => next() }, ctx.t('Next')),
            current === items.length - 1 &&
              React.createElement(
                Button,
                {
                  type: 'primary',
                  onClick: async () => {
                    const resource = ctx.resource;
                    await resource.create(formData);
                    ctx.message.success(ctx.t('Processing complete!'));
                    ctx.view?.close();
                  },
                },
                ctx.t('Submit'),
              ),
          ),
        ),
      ),
    ),
  );
};
//# sourceMappingURL=DatasourceSettingForm.js.map
