/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { useCollectionRecordData, useCompile, Input } from '@nocobase/client';
import { useField } from '@formily/react';
import { Popover } from 'antd';
import React from 'react';
import { SetFilterTargetKey } from './SetFilterTargetKey';
export const CollectionTitle = (props) => {
  const record = useCollectionRecordData() || {};
  const compile = useCompile();
  const field = useField();
  if (field.editable) {
    return React.createElement(Input, { ...props });
  }
  if (record?.filterTargetKey) {
    return compile(record.title);
  }
  return React.createElement(
    'div',
    { style: { display: 'inline' } },
    React.createElement(
      Popover,
      {
        trigger: ['click'],
        content: React.createElement(SetFilterTargetKey, { size: 'small', style: { width: '20em' } }),
      },
      React.createElement(ExclamationCircleTwoTone, { style: { marginRight: '0.3em' }, twoToneColor: '#faad14' }),
    ),
    compile(record.title),
  );
};
//# sourceMappingURL=CollectionTitle.js.map
