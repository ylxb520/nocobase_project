/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Form, Input } from 'antd';
import { useFlowContext } from '@nocobase/flow-engine';
import { useCollectionContext } from '../../context';
import { SortFieldsTransfer } from '../basic';
export const SortSetting = ({ form, name, show }) => {
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
    React.createElement(
      Form.Item,
      { label: ctx.t('Sort Fields'), name: 'sort' },
      React.createElement(SortFieldsTransfer, null),
    ),
  );
};
//# sourceMappingURL=SortSetting.js.map
