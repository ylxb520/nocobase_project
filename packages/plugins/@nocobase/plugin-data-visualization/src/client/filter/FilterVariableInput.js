/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  SchemaComponent,
  VariableInput,
  VariableScopeProvider,
  getShouldChange,
  CollectionProvider,
  IsInNocoBaseRecursionFieldContext,
} from '@nocobase/client';
import { useMemoizedFn } from 'ahooks';
import React, { useEffect } from 'react';
import { useGeneralVariableOptions } from '../hooks';
export const ChartFilterVariableInput = (props) => {
  const { value, onChange, fieldSchema } = props;
  const collectionField = fieldSchema?.['x-collection-field'] || '';
  const [collection] = collectionField.split('.');
  const options = useGeneralVariableOptions(fieldSchema, fieldSchema['x-component-props']?.['filter-operator']);
  const schema = {
    ...fieldSchema,
    'x-component': fieldSchema['x-component'] || 'Input',
    title: '',
    name: 'value',
    default: '',
    'x-read-pretty': false,
  };
  const componentProps = fieldSchema['x-component-props'] || {};
  const handleChange = useMemoizedFn(onChange);
  useEffect(() => {
    if (fieldSchema.default) {
      handleChange({ value: fieldSchema.default });
    }
  }, [fieldSchema.default, handleChange]);
  return React.createElement(
    VariableScopeProvider,
    { scope: options },
    React.createElement(VariableInput, {
      ...componentProps,
      renderSchemaComponent: () =>
        React.createElement(
          CollectionProvider,
          { name: collection, allowNull: !collection },
          React.createElement(
            IsInNocoBaseRecursionFieldContext.Provider,
            { value: false },
            React.createElement(SchemaComponent, { schema: schema }),
          ),
        ),
      fieldNames: {},
      value: value?.value,
      scope: options,
      onChange: (v) => {
        onChange({ value: v });
      },
      shouldChange: getShouldChange({}),
    }),
  );
};
//# sourceMappingURL=FilterVariableInput.js.map
