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
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect, mapReadPretty, useField, useForm, useFieldSchema } from '@formily/react';
import { ActionContextProvider, AssociationField, SchemaComponent } from '@nocobase/client';
import { DepartmentTable } from './DepartmentTable';
import { useDepartmentTranslation } from '../locale';
import { getDepartmentTitle } from '../utils';
import { useRequest } from '@nocobase/client';
const useDataSource = (options) => {
  const defaultRequest = {
    resource: 'departments',
    action: 'list',
    params: {
      appends: ['parent(recursively=true)'],
      sort: ['createdAt'],
    },
  };
  const service = useRequest(defaultRequest, options);
  return {
    ...service,
    defaultRequest,
  };
};
// Edit Mode
const EditableDepartmentsField = () => {
  const { t } = useDepartmentTranslation();
  const field = useField();
  const [visible, setVisible] = useState(false);
  const [selectValue, setSelectValue] = useState([]);
  useEffect(() => {
    if (!field.value) return;
    const arr = Array.isArray(field.value) ? field.value : [];
    setSelectValue(
      arr.map((dept) => {
        const id = typeof dept === 'object' ? dept.id : dept;
        const label = typeof dept === 'object' ? dept.title || getDepartmentTitle(dept) || String(id) : String(id);
        return { value: id, label };
      }),
    );
  }, [field.value]);
  const useConfirmDepartments = () => {
    const drawerForm = useForm();
    return {
      run() {
        const { departments = [] } = drawerForm.values || {};
        const current = Array.isArray(field.value) ? field.value : [];
        const merged = [...current, ...departments];
        const map = new Map();
        merged.forEach((d) => map.set(d.id ?? d, d));
        const next = Array.from(map.values());
        field.setValue(next);
        drawerForm.reset();
        setVisible(false);
      },
    };
  };
  const useDisabled = () => ({
    disabled: (record) => {
      const current = Array.isArray(field.value) ? field.value : [];
      return current.some((d) => (typeof d === 'object' ? d.id : d) === record.id);
    },
  });
  const handleSelectChange = (val) => {
    if (!val || val.length === 0) {
      field.setValue([]);
      setSelectValue([]);
      return;
    }
    setSelectValue(val);
    field.setValue(
      val.map((v) => ({
        id: v.value,
        title: v.label,
      })),
    );
  };
  const departmentsFieldSchema = {
    type: 'void',
    properties: {
      drawer: {
        title: t('Select Departments'),
        'x-decorator': 'Form',
        'x-component': 'Action.Drawer',
        properties: {
          table: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'DepartmentTable',
            'x-component-props': {
              useDataSource: '{{ useDataSource }}',
              useDisabled: '{{ useDisabled }}',
            },
          },
          footer: {
            type: 'void',
            'x-component': 'Action.Drawer.Footer',
            properties: {
              cancel: {
                title: t('Cancel'),
                'x-component': 'Action',
                'x-component-props': {
                  useAction: '{{ cm.useCancelAction }}',
                },
              },
              confirm: {
                title: t('Confirm'),
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction: '{{ useConfirmDepartments }}',
                },
              },
            },
          },
        },
      },
    },
  };
  return React.createElement(
    ActionContextProvider,
    { value: { visible, setVisible } },
    React.createElement(Select, {
      mode: 'multiple',
      labelInValue: true,
      open: false,
      value: selectValue,
      onChange: handleSelectChange,
      onDropdownVisibleChange: (open) => setVisible(open),
    }),
    React.createElement(SchemaComponent, {
      schema: departmentsFieldSchema,
      components: { DepartmentTable },
      scope: { useDataSource, useConfirmDepartments, useDisabled },
    }),
  );
};
// Read Mode
const ReadonlyDepartmentsField = (props) => {
  const fieldSchema = useFieldSchema();
  fieldSchema['x-component-props'] = {
    ...fieldSchema['x-component-props'],
    fieldNames: {
      label: 'title',
      value: 'id',
    },
  };
  return React.createElement(AssociationField.ReadPretty, { ...props });
};
export const DepartmentsField = connect(EditableDepartmentsField, mapReadPretty(ReadonlyDepartmentsField));
//# sourceMappingURL=DepartmentsField.js.map
