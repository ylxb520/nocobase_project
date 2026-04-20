/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { createForm, onFieldInit, onFieldMount, onFieldUnmount } from '@formily/core';
import { ChartFilterContext } from './FilterProvider';
import { FormV2, VariablesContext, useLocalVariables } from '@nocobase/client';
import { setDefaultValue } from './utils';
import { useChartFilter } from '../hooks';
export const ChartFilterForm = memo((props) => {
  const { setField, removeField, setForm } = useContext(ChartFilterContext);
  const { getTranslatedTitle } = useChartFilter();
  const variables = useRef(null);
  variables.current = useContext(VariablesContext);
  const localVariables = useLocalVariables();
  const form = useMemo(
    () =>
      createForm({
        effects() {
          const getField = (field) => {
            if (field.displayName !== 'Field') {
              return null;
            }
            const { name } = field.props || {};
            return name;
          };
          onFieldInit('*', (field) => {
            const name = getField(field);
            if (!name) {
              return;
            }
            field.setValue(null);
          });
          onFieldMount('*', async (field) => {
            const name = getField(field);
            if (!name) {
              return;
            }
            setField(name, {
              title: field.title,
              operator: field.componentProps['filter-operator'],
              dataSource: field.componentProps['data-source'],
              collectionField: field.componentProps['collection-field'],
            });
            // parse field title
            if (field.title.includes('/')) {
              field.title = getTranslatedTitle(field.title);
            }
            // parse default value
            setDefaultValue(field, variables.current, localVariables);
          });
          onFieldUnmount('*', (field) => {
            const name = getField(field);
            if (!name) {
              return;
            }
            removeField(name);
          });
        },
      }),
    [setField, getTranslatedTitle, removeField, variables, localVariables],
  );
  useEffect(() => setForm(form), [form, setForm]);
  return React.createElement(FormV2, { ...props, form: form });
});
ChartFilterForm.displayName = 'ChartFilterForm';
//# sourceMappingURL=FilterForm.js.map
