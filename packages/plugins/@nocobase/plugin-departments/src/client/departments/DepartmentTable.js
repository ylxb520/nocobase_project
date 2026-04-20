/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import {
  CollectionContext,
  CollectionProvider_deprecated,
  ResourceActionContext,
  SchemaComponent,
  mergeFilter,
  removeNullCondition,
  useFilterFieldOptions,
  useResourceActionContext,
} from '@nocobase/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDepartmentManager } from '../hooks';
import { Table } from 'antd';
import { departmentCollection } from '../collections/departments';
import { useDepartmentTranslation } from '../locale';
import { useField } from '@formily/react';
import { uid } from '@formily/shared';
import { getDepartmentTitle } from '../utils';
const ExpandMetaContext = createContext({});
export const useFilterActionProps = () => {
  const { setHasFilter, setExpandedKeys } = useContext(ExpandMetaContext);
  const { t } = useDepartmentTranslation();
  const collection = useContext(CollectionContext);
  const options = useFilterFieldOptions(collection.fields);
  const service = useResourceActionContext();
  const { run, defaultRequest } = service;
  const field = useField();
  const { params } = defaultRequest || {};
  return {
    options,
    onSubmit: async (values) => {
      // filter parameter for the block
      const defaultFilter = params.filter;
      // filter parameter for the filter action
      const filter = removeNullCondition(values?.filter);
      run({
        ...params,
        page: 1,
        pageSize: 10,
        filter: mergeFilter([filter, defaultFilter]),
      });
      const items = filter?.$and || filter?.$or;
      if (items?.length) {
        field.title = t('{{count}} filter items', { count: items?.length || 0 });
        setHasFilter(true);
      } else {
        field.title = t('Filter');
        setHasFilter(false);
      }
    },
    onReset() {
      run({
        ...(params || {}),
        filter: {
          ...(params?.filter || {}),
          parentId: null,
        },
        page: 1,
        pageSize: 10,
      });
      field.title = t('Filter');
      setHasFilter(false);
      setExpandedKeys([]);
    },
  };
};
const useDefaultDisabled = () => {
  return {
    disabled: () => false,
  };
};
const InternalDepartmentTable = ({ useDisabled = useDefaultDisabled }) => {
  const { t } = useDepartmentTranslation();
  const ctx = useResourceActionContext();
  console.log(ctx);
  const { run, data, loading, defaultRequest } = ctx;
  const { resource, resourceOf, params } = defaultRequest || {};
  const { treeData, initData, loadData } = useDepartmentManager({
    resource,
    resourceOf,
    params,
  });
  const field = useField();
  const { disabled } = useDisabled();
  const { hasFilter, expandedKeys, setExpandedKeys } = useContext(ExpandMetaContext);
  useEffect(() => {
    if (hasFilter) {
      return;
    }
    initData(data?.data);
  }, [data, initData, loading, hasFilter]);
  const pagination = {};
  if (params?.pageSize) {
    pagination.defaultPageSize = params.pageSize;
  }
  if (!pagination.total && data?.meta) {
    const { count, page, pageSize } = data.meta;
    pagination.total = count;
    pagination.current = page;
    pagination.pageSize = pageSize;
  }
  return React.createElement(Table, {
    rowKey: 'id',
    columns: [
      {
        dataIndex: 'title',
        title: t('Department name'),
        render: (text, record) => (hasFilter ? getDepartmentTitle(record) : text),
      },
    ],
    rowSelection: {
      selectedRowKeys: (field?.value || []).map((dept) => dept.id),
      onChange: (keys, depts) => field?.setValue?.(depts),
      getCheckboxProps: (record) => ({
        disabled: disabled(record),
      }),
    },
    pagination: {
      showSizeChanger: true,
      ...pagination,
      onChange(page, pageSize) {
        run({
          ...(ctx?.params?.[0] || {}),
          page,
          pageSize,
        });
      },
    },
    dataSource: hasFilter ? data?.data || [] : treeData,
    expandable: {
      onExpand: (expanded, record) => {
        loadData({
          key: record.id,
          children: record.children,
        });
      },
      expandedRowKeys: expandedKeys,
      onExpandedRowsChange: (keys) => setExpandedKeys(keys),
    },
  });
};
const RequestProvider = (props) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [hasFilter, setHasFilter] = useState(false);
  const { useDataSource } = props;
  const service = useDataSource({
    manual: true,
  });
  useEffect(() => {
    service.run({
      filter: {
        parentId: null,
      },
      pageSize: 10,
    });
  }, []);
  return React.createElement(
    ResourceActionContext.Provider,
    { value: { ...service } },
    React.createElement(
      CollectionProvider_deprecated,
      { collection: departmentCollection },
      React.createElement(
        ExpandMetaContext.Provider,
        { value: { expandedKeys, setExpandedKeys, hasFilter, setHasFilter } },
        props.children,
      ),
    ),
  );
};
export const DepartmentTable = ({ useDataSource, useDisabled }) => {
  return React.createElement(SchemaComponent, {
    scope: { useDisabled, useFilterActionProps },
    components: { InternalDepartmentTable, RequestProvider },
    schema: {
      type: 'void',
      properties: {
        [uid()]: {
          type: 'void',
          'x-component': 'RequestProvider',
          'x-component-props': {
            useDataSource,
          },
          properties: {
            actions: {
              type: 'void',
              'x-component': 'ActionBar',
              'x-component-props': {
                style: {
                  marginBottom: 16,
                },
              },
              properties: {
                filter: {
                  type: 'void',
                  title: '{{ t("Filter") }}',
                  default: {
                    $and: [{ title: { $includes: '' } }],
                  },
                  'x-action': 'filter',
                  'x-component': 'Filter.Action',
                  'x-use-component-props': 'useFilterActionProps',
                  'x-component-props': {
                    icon: 'FilterOutlined',
                  },
                  'x-align': 'left',
                },
              },
            },
            departments: {
              type: 'array',
              'x-component': 'InternalDepartmentTable',
              'x-component-props': {
                useDisabled: '{{ useDisabled }}',
              },
            },
          },
        },
      },
    },
  });
};
//# sourceMappingURL=DepartmentTable.js.map
