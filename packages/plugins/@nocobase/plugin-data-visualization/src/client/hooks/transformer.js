/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import transformers from '../transformers';
import { lang } from '../locale';
import { getSelectedFields } from '../utils';
import { useField } from '@formily/react';
import { uid } from '@formily/shared';
export const useFieldSelectProps = (fields) =>
  function useFieldSelectProps() {
    const field = useField();
    const query = field.query('query').get('value') || {};
    const selectedFields = getSelectedFields(fields, query);
    const supports = Object.keys(transformers).filter((key) => key !== 'general');
    return {
      onChange: (value) => {
        field.value = value;
        const typeField = field.query('.type').take();
        if (!value) {
          typeField.setState({
            value: null,
          });
        }
        const fieldProps = selectedFields.find((field) => field.value === value);
        typeField.dataSource = supports.map((key) => ({
          label: lang(key),
          value: key,
        }));
        const map = {
          createdAt: 'datetime',
          updatedAt: 'datetime',
          double: 'number',
          integer: 'number',
          percent: 'number',
        };
        const fieldInterface = fieldProps?.interface;
        const fieldType = fieldProps?.type;
        const key = map[fieldInterface] || map[fieldType] || fieldType;
        if (supports.includes(key)) {
          typeField.setState({
            value: key,
          });
          return;
        }
        typeField.setState({
          value: null,
        });
      },
    };
  };
export const useFieldTypeSelectProps = () => {
  const field = useField();
  const supports = Object.keys(transformers).filter((key) => key !== 'general');
  const options = supports.map((key) => ({
    label: lang(key),
    value: key,
  }));
  return {
    options,
    onChange: (value) => {
      field.value = value;
      const transformerField = field.query('.format').take();
      transformerField.setValue(null);
    },
  };
};
export const useTransformerSelectProps = () => {
  const field = useField();
  return {
    onChange: (value) => {
      field.value = value;
      const argumentField = field.query('.argument').take();
      argumentField.setValue(null);
    },
  };
};
export const useTransformers = (field) => {
  const selectedType = field.query('.type').get('value');
  if (!selectedType) {
    field.dataSource = [];
    return;
  }
  const options = Object.entries({ ...transformers.general, ...(transformers[selectedType] || {}) }).map(
    ([key, config]) => {
      const label = typeof config === 'function' ? key : config.label || key;
      return {
        label: lang(label),
        value: key,
      };
    },
  );
  field.dataSource = options;
};
export const useArgument = (field) => {
  const selectedType = field.query('.type').get('value');
  const format = field.query('.format').get('value');
  if (!format || !selectedType) {
    field.setComponentProps({
      schema: null,
    });
    return;
  }
  const config = transformers[selectedType][format] || transformers['general'][format];
  if (!config || typeof config === 'function') {
    field.setComponentProps({
      schema: null,
    });
    return;
  }
  const id = uid();
  field.setComponentProps({
    schema: {
      name: id,
      ...config.schema,
    },
  });
};
export const useFieldTransformer = (transform, locale = 'en-US') => {
  const transformersMap = (transform || [])
    .filter((item) => item.field && item.type && item.format)
    .reduce((mp, item) => {
      const transformer = transformers[item.type][item.format] || transformers.general[item.format];
      if (!transformer) {
        return mp;
      }
      mp[item.field] = [...(mp[item.field] || []), { transformer, argument: item.argument }];
      return mp;
    }, {});
  const result = {};
  Object.entries(transformersMap).forEach(([field, transformers]) => {
    result[field] = transformers.reduce(
      (fn, config) => {
        const { transformer } = config;
        let { argument } = config;
        return (val) => {
          try {
            if (typeof transformer === 'function') {
              return transformer(fn(val), argument);
            }
            if (!argument && !transformer.schema) {
              argument = locale;
            }
            return transformer.fn(fn(val), argument);
          } catch (e) {
            console.log(e);
            return val;
          }
        };
      },
      (val) => val,
    );
  });
  return result;
};
//# sourceMappingURL=transformer.js.map
