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
  ActionContextProvider,
  SchemaComponent,
  useAPIClient,
  useRecord,
  useRequest,
  useTableBlockContext,
} from '@nocobase/client';
import React, { useState } from 'react';
import { Tag, Button, Dropdown, App } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { useField, useForm } from '@formily/react';
import { userDepartmentsSchema } from './schemas/users';
import { getDepartmentTitle } from '../utils';
import { useDepartmentTranslation } from '../locale';
import { DepartmentTable } from './DepartmentTable';
const useDataSource = (options) => {
  const defaultRequest = {
    resource: 'departments',
    action: 'list',
    params: {
      appends: ['parent(recursively=true)'],
      // filter: {
      //   parentId: null,
      // },
      sort: ['createdAt'],
    },
  };
  const service = useRequest(defaultRequest, options);
  return {
    ...service,
    defaultRequest,
  };
};
export const UserDepartmentsField = () => {
  const { modal, message } = App.useApp();
  const { t } = useDepartmentTranslation();
  const [visible, setVisible] = useState(false);
  const user = useRecord();
  const field = useField();
  const {
    service: { refresh },
  } = useTableBlockContext();
  const formatData = (data) => {
    if (!data?.length) {
      return [];
    }
    return data.map((department) => ({
      ...department,
      isMain: department.id === user.mainDepartmentId,
      isOwner: department.departmentsUsers?.isOwner,
      title: getDepartmentTitle(department),
    }));
  };
  const api = useAPIClient();
  useRequest(
    () =>
      api
        .resource(`users.departments`, user.id)
        .list({
          appends: ['parent(recursively=true)'],
          paginate: false,
        })
        .then((res) => {
          const data = formatData(res?.data?.data);
          field.setValue(data);
        }),
    {
      ready: user.id,
    },
  );
  const useAddDepartments = () => {
    const api = useAPIClient();
    const drawerForm = useForm();
    const { departments } = drawerForm.values || {};
    return {
      async run() {
        await api.resource('users.departments', user.id).add({
          values: departments.map((dept) => dept.id),
        });
        drawerForm.reset();
        field.setValue([
          ...field.value,
          ...departments.map((dept, index) => ({
            ...dept,
            isMain: index === 0 && field.value.length === 0,
            title: getDepartmentTitle(dept),
          })),
        ]);
        setVisible(false);
        refresh();
      },
    };
  };
  const removeDepartment = (dept) => {
    modal.confirm({
      title: t('Remove department'),
      content: t('Are you sure you want to remove it?'),
      onOk: async () => {
        await api.resource('users.departments', user.id).remove({ values: [dept.id] });
        message.success(t('Deleted successfully'));
        field.setValue(
          field.value
            .filter((d) => d.id !== dept.id)
            .map((d, index) => ({
              ...d,
              isMain: (dept.isMain && index === 0) || d.isMain,
            })),
        );
        refresh();
      },
    });
  };
  const setMainDepartment = async (dept) => {
    await api.resource('users').update({
      filterByTk: user.id,
      values: { mainDepartmentId: dept.id },
    });
    message.success(t('Set successfully'));
    field.setValue(
      (field.value || []).map((d) => ({
        ...d,
        isMain: d.id === dept.id,
      })),
    );
    refresh();
  };
  const setOwner = async (dept) => {
    await api.resource('departments').setOwner({
      values: {
        userId: user.id,
        departmentId: dept.id,
      },
    });
    message.success(t('Set successfully'));
    field.setValue(
      field.value.map((d) => ({
        ...d,
        isOwner: d.id === dept.id ? true : d.isOwner,
      })),
    );
    refresh();
  };
  const removeOwner = async (dept) => {
    await api.resource('departments').removeOwner({
      values: {
        userId: user.id,
        departmentId: dept.id,
      },
    });
    message.success(t('Set successfully'));
    field.setValue(
      field.value.map((d) => ({
        ...d,
        isOwner: d.id === dept.id ? false : d.isOwner,
      })),
    );
    refresh();
  };
  const handleClick = (key, dept) => {
    switch (key) {
      case 'setMain':
        setMainDepartment(dept);
        break;
      case 'setOwner':
        setOwner(dept);
        break;
      case 'removeOwner':
        removeOwner(dept);
        break;
      case 'remove':
        removeDepartment(dept);
    }
  };
  const useDisabled = () => ({
    disabled: (record) => {
      return field.value.some((dept) => dept.id === record.id);
    },
  });
  return React.createElement(
    ActionContextProvider,
    { value: { visible, setVisible } },
    React.createElement(
      React.Fragment,
      null,
      (field?.value || []).map((dept) =>
        React.createElement(
          Tag,
          { style: { padding: '5px 8px', background: 'transparent', marginBottom: '5px' }, key: dept.id },
          React.createElement('span', { style: { marginRight: '5px' } }, dept.title),
          dept.isMain ? React.createElement(Tag, { color: 'processing', bordered: false }, t('Main')) : '',
          React.createElement(
            Dropdown,
            {
              menu: {
                items: [
                  ...(dept.isMain
                    ? []
                    : [
                        {
                          label: t('Set as main department'),
                          key: 'setMain',
                        },
                      ]),
                  // {
                  //   label: dept.isOwner ? t('Remove owner role') : t('Set as owner'),
                  //   key: dept.isOwner ? 'removeOwner' : 'setOwner',
                  // },
                  {
                    label: t('Remove'),
                    key: 'remove',
                  },
                ],
                onClick: ({ key }) => handleClick(key, dept),
              },
            },
            React.createElement('div', { style: { float: 'right' } }, React.createElement(MoreOutlined, null)),
          ),
        ),
      ),
      React.createElement(Button, { icon: React.createElement(PlusOutlined, null), onClick: () => setVisible(true) }),
    ),
    React.createElement(SchemaComponent, {
      schema: userDepartmentsSchema,
      components: { DepartmentTable },
      scope: { user, useDataSource, useAddDepartments, useDisabled },
    }),
  );
};
//# sourceMappingURL=UserDepartmentsField.js.map
