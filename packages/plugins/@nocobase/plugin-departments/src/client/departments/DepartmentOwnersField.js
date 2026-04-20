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
  ResourceActionProvider,
  SchemaComponent,
  useActionContext,
  useRecord,
  AssociationField,
} from '@nocobase/client';
import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import { connect, mapReadPretty, useField, useFieldSchema } from '@formily/react';
import { departmentOwnersSchema } from './schemas/departments';
import { useDepartmentTranslation } from '../locale';
import { useFilterActionProps } from '../hooks';
// Edit mode
const EditableDepartmentOwnersField = () => {
  const [visible, setVisible] = useState(false);
  const department = useRecord();
  const field = useField();
  const [value, setValue] = useState([]);
  const selectedRows = useRef([]);
  const { t } = useDepartmentTranslation();
  const isCreate = !department?.id;
  const handleSelect = (_, rows) => {
    selectedRows.current = rows;
  };
  const useSelectOwners = () => {
    const { setVisible } = useActionContext();
    return {
      run() {
        const selected = field.value || [];
        field.setValue([...selected, ...selectedRows.current]);
        selectedRows.current = [];
        setVisible(false);
      },
    };
  };
  useEffect(() => {
    if (!field.value) {
      return;
    }
    setValue(
      field.value.map((owner) => ({
        value: owner.id,
        label: owner.nickname || owner.username,
      })),
    );
  }, [field.value]);
  const RequestProvider = (props) =>
    React.createElement(
      ResourceActionProvider,
      {
        collection: 'users',
        request: {
          resource: `departments/${department.id}/members`,
          action: 'list',
          params: {
            disableDefaultAppends: true,
            filter: field.value?.length
              ? {
                  id: {
                    $notIn: field.value.map((owner) => owner.id),
                  },
                }
              : {},
          },
        },
      },
      props.children,
    );
  return React.createElement(
    ActionContextProvider,
    { value: { visible, setVisible } },
    React.createElement(Select, {
      open: false,
      onChange: (value) => {
        if (!value) {
          field.setValue([]);
          return;
        }
        field.setValue(
          value.map(({ label, value }) => ({
            id: value,
            nickname: label,
          })),
        );
      },
      mode: 'multiple',
      value: value,
      labelInValue: true,
      onDropdownVisibleChange: (open) => setVisible(open),
      disabled: isCreate,
      placeholder: isCreate ? t('Please create department first') : '',
    }),
    React.createElement(SchemaComponent, {
      schema: departmentOwnersSchema,
      components: { RequestProvider },
      scope: { department, handleSelect, useSelectOwners, useFilterActionProps },
    }),
  );
};
// Read Mode
const ReadonlyDepartmentOwnersField = (props) => {
  const fieldSchema = useFieldSchema();
  fieldSchema['x-component-props'] = {
    ...fieldSchema['x-component-props'],
    fieldNames: {
      label: 'nickname',
      value: 'id',
    },
  };
  return React.createElement(AssociationField.ReadPretty, { ...props });
};
export const DepartmentOwnersField = connect(
  EditableDepartmentOwnersField,
  mapReadPretty(ReadonlyDepartmentOwnersField),
);
//# sourceMappingURL=DepartmentOwnersField.js.map
