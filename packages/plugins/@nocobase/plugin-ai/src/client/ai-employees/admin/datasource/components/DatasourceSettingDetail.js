/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Space, Tabs } from 'antd';
import { observable, useFlowContext } from '@nocobase/flow-engine';
import { CollectionSetting, FieldsSetting, FilterSetting, Preview, SortSetting } from './form-steps';
import { CollectionContext, CurrentCollection } from '../context';
const dataScope = observable({
  logic: '$and',
  items: [],
});
const TabDecorator = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};
export const DatasourceSettingDetail = ({ record }) => {
  const ctx = useFlowContext();
  const { Header, Footer } = ctx.view;
  const [collectionForm] = Form.useForm();
  const [fieldsForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [sortForm] = Form.useForm();
  const [formData, setFormData] = useState({});
  const allForms = [collectionForm, fieldsForm, filterForm, sortForm];
  const [collection, setCollection] = useState(null);
  useEffect(() => {
    setFormData(record);
    const { datasource, collectionName } = record;
    setCollection(ctx.dataSourceManager.getCollection(datasource, collectionName));
    collectionForm.setFieldsValue(record);
    collectionForm.setFieldValue('collection', [datasource, collectionName]);
    fieldsForm.setFieldValue('fields', record.fields);
    sortForm.setFieldValue('sort', record.sort);
    dataScope.items = record.filter?.items || [];
  }, [record]);
  const onSubmit = async () => {
    try {
      let data = {};
      for (const form of allForms) {
        const { collection, datasource, collectionName, ...rest } = await form.validateFields();
        data = { ...data, ...rest };
      }
      data['filter'] = dataScope;
      await ctx.resource.update(record.id, data);
      ctx.message.success(ctx.t('Save datasource successfully'));
      ctx.view.close();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  const items = [
    {
      key: 'Tab-0',
      label: ctx.t('Collection'),
      children: React.createElement(
        TabDecorator,
        null,
        React.createElement(CollectionSetting, {
          form: collectionForm,
          name: 'collectionSetting',
          show: true,
          disableCollectionCascader: true,
        }),
      ),
    },
    {
      key: 'Tab-1',
      label: ctx.t('Fields'),
      children: React.createElement(
        TabDecorator,
        null,
        React.createElement(FieldsSetting, { form: fieldsForm, name: 'fieldsSetting', show: true }),
      ),
    },
    {
      key: 'Tab-2',
      label: ctx.t('Filter'),
      children: React.createElement(
        TabDecorator,
        null,
        React.createElement(FilterSetting, {
          form: filterForm,
          dataScope: dataScope,
          name: 'filterSetting',
          show: true,
        }),
      ),
    },
    {
      key: 'Tab-3',
      label: ctx.t('Sort'),
      children: React.createElement(
        TabDecorator,
        null,
        React.createElement(SortSetting, { form: sortForm, name: 'sortSetting', show: true }),
      ),
    },
    {
      key: 'Tab-4',
      label: ctx.t('Preview'),
      children: React.createElement(
        TabDecorator,
        null,
        React.createElement(Preview, { formData: formData, show: true }),
      ),
    },
  ];
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      CollectionContext.Provider,
      { value: new CurrentCollection(collection) },
      React.createElement(Header, { title: ctx.t('Edit datasource') }),
      React.createElement(Tabs, {
        defaultActiveKey: 'Tab-0',
        items: items,
        onChange: () => {
          let data = {};
          for (const form of allForms) {
            const { collection, datasource, collectionName, ...rest } = form.getFieldsValue();
            data = { ...data, ...rest };
          }
          data['filter'] = dataScope;
          setFormData((prev) => ({ ...prev, ...data }));
        },
      }),
      React.createElement(
        Footer,
        null,
        React.createElement(
          Flex,
          { justify: 'flex-end', align: 'end' },
          React.createElement(
            Space,
            null,
            ctx.view &&
              React.createElement(
                Button,
                {
                  onClick: () => {
                    ctx.view.close();
                  },
                },
                ctx.t('Cancel'),
              ),
            React.createElement(Button, { type: 'primary', onClick: onSubmit }, ctx.t('Submit')),
          ),
        ),
      ),
    ),
  );
};
//# sourceMappingURL=DatasourceSettingDetail.js.map
