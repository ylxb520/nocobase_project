/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { createCollectionContextMeta, observer, useFlowContext } from '@nocobase/flow-engine';
import { VariableFilterItem, FilterGroup } from '@nocobase/client';
import { useCollectionContext } from '../../context';
const Filter = observer(({ value }) => {
  const ctx = useFlowContext();
  const currentCollection = useCollectionContext();
  useEffect(() => {
    if (currentCollection.collection) {
      ctx.model.context.defineProperty('collection', {
        get: () => currentCollection.collection,
        meta: createCollectionContextMeta(() => currentCollection.collection, ctx.t('Current collection')),
      });
    }
  }, [ctx, currentCollection]);
  return React.createElement(FilterGroup, {
    value: value,
    FilterItem: (props) => React.createElement(VariableFilterItem, { ...props, model: ctx.model }),
  });
});
export const FilterSetting = ({ form, dataScope, name, show }) => {
  const ctx = useFlowContext();
  const currentCollection = useCollectionContext();
  return React.createElement(
    Form,
    { form: form, name: name, layout: 'vertical', colon: true, style: !show && { display: 'none' } },
    React.createElement(
      Form.Item,
      { label: ctx.t('Collection') },
      React.createElement(Input, { value: currentCollection.displayName, disabled: true }),
    ),
    React.createElement(Form.Item, { label: ctx.t('Filter group') }, React.createElement(Filter, { value: dataScope })),
  );
};
//# sourceMappingURL=FilterSetting.js.map
