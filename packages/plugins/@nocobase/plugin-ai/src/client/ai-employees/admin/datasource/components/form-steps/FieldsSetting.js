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
import { FieldsTransfer } from '../basic';
import { useCollectionContext } from '../../context';
export const FieldsSetting = ({ form, name, show }) => {
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
      { label: ctx.t('Fields'), name: 'fields', rules: [{ required: true, message: ctx.t('Please select fields') }] },
      React.createElement(FieldsTransfer, null),
    ),
  );
};
//# sourceMappingURL=FieldsSetting.js.map
