/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css } from '@emotion/css';
import { connect, useField, useFieldSchema } from '@formily/react';
import { merge } from '@formily/shared';
import {
  CollectionFieldProvider,
  useCollectionField_deprecated,
  useCollection_deprecated,
  useCompile,
  useComponent,
} from '@nocobase/client';
import { Checkbox, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
export const DeletedField = () => {
  const { t } = useTranslation();
  return React.createElement('div', { style: { color: '#ccc' } }, t('The field has bee deleted'));
};
const InternalField = (props) => {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { uiSchema } = useCollectionField_deprecated();
  const component = useComponent(uiSchema?.['x-component']);
  const compile = useCompile();
  const setFieldProps = (key, value) => {
    field[key] = typeof field[key] === 'undefined' ? value : field[key];
  };
  useEffect(() => {
    if (!uiSchema) {
      return;
    }
    setFieldProps('content', uiSchema['x-content']);
    setFieldProps('description', uiSchema.description);
    setFieldProps('initialValue', uiSchema.default);
    // if (!field.validator && uiSchema['x-validator']) {
    //   field.validator = uiSchema['x-validator'];
    // }
    if (fieldSchema['x-disabled'] === true) {
      field.disabled = true;
    }
    if (fieldSchema['x-read-pretty'] === true) {
      field.readPretty = true;
    }
    field.required = true;
    // @ts-ignore
    const originalProps = compile(uiSchema['x-component-props']) || {};
    const componentProps = merge(originalProps, field.componentProps || {});
    field.componentProps = componentProps;
    // field.component = [component, componentProps];
  }, [JSON.stringify(uiSchema)]);
  if (!uiSchema) {
    return null;
  }
  return React.createElement(component, props, props.children);
};
const CollectionField = connect((props) => {
  const fieldSchema = useFieldSchema();
  return React.createElement(
    CollectionFieldProvider,
    { name: fieldSchema.name },
    React.createElement(InternalField, { ...props }),
  );
});
export var BulkEditFormItemValueType;
(function (BulkEditFormItemValueType) {
  BulkEditFormItemValueType[(BulkEditFormItemValueType['RemainsTheSame'] = 1)] = 'RemainsTheSame';
  BulkEditFormItemValueType[(BulkEditFormItemValueType['ChangedTo'] = 2)] = 'ChangedTo';
  BulkEditFormItemValueType[(BulkEditFormItemValueType['Clear'] = 3)] = 'Clear';
  BulkEditFormItemValueType[(BulkEditFormItemValueType['AddAttach'] = 4)] = 'AddAttach';
})(BulkEditFormItemValueType || (BulkEditFormItemValueType = {}));
export const BulkEditField = (props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const [type, setType] = useState(BulkEditFormItemValueType.RemainsTheSame);
  const [value, setValue] = useState(null);
  const { getField } = useCollection_deprecated();
  const collectionField = getField(fieldSchema.name) || {};
  const { uiSchema } = collectionField;
  useEffect(() => {
    field.value = toFormFieldValue({ [type]: value });
    if (field.required) {
      if (field.value) {
        field.modify();
        field.form.clearErrors(field.address);
      } else if (field.modified) {
        field.form.validate(field.address);
      }
    }
  }, [field, type, value]);
  useEffect(() => {
    field.dataSource = field.dataSource || uiSchema.enum;
    field.data = field.data || {};
    field.data.dataSource = uiSchema.enum;
  }, [uiSchema]);
  useEffect(() => {
    if (field.value === null) {
      setValue(undefined);
    }
  }, [field.value]);
  const typeChangeHandler = (val) => {
    setType(val);
    field.required = val === BulkEditFormItemValueType.ChangedTo;
  };
  const valueChangeHandler = (val) => {
    setValue(val?.target?.value ?? val?.target?.checked ?? val);
  };
  return React.createElement(
    Space,
    {
      className: css`
        display: flex;
        > .ant-space-item {
          width: 100%;
        }
      `,
    },
    React.createElement(
      Select,
      { defaultValue: type, value: type, onChange: typeChangeHandler },
      React.createElement(Select.Option, { value: BulkEditFormItemValueType.RemainsTheSame }, t('Remains the same')),
      React.createElement(Select.Option, { value: BulkEditFormItemValueType.ChangedTo }, t('Changed to')),
      React.createElement(Select.Option, { value: BulkEditFormItemValueType.Clear }, t('Clear')),
    ),
    [BulkEditFormItemValueType.ChangedTo, BulkEditFormItemValueType.AddAttach].includes(type) &&
      collectionField?.interface !== 'checkbox' &&
      React.createElement(CollectionField, {
        ...props,
        value: value,
        onChange: valueChangeHandler,
        style: { minWidth: 150 },
      }),
    [BulkEditFormItemValueType.ChangedTo, BulkEditFormItemValueType.AddAttach].includes(type) &&
      collectionField?.interface === 'checkbox' &&
      React.createElement(Checkbox, { checked: value, onChange: valueChangeHandler }),
  );
};
function toFormFieldValue(value) {
  if (BulkEditFormItemValueType.Clear in value) {
    return null;
  } else if (BulkEditFormItemValueType.ChangedTo in value) {
    return value[BulkEditFormItemValueType.ChangedTo];
  } else if (BulkEditFormItemValueType.RemainsTheSame in value) {
    return;
  }
}
//# sourceMappingURL=BulkEditField.js.map
