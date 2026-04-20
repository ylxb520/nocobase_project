/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { isArrayField } from '@formily/core';
import { observer, useField } from '@formily/react';
import { isValid } from '@formily/shared';
import { Tag } from 'antd';
import React from 'react';
import { defaultFieldNames, getCurrentOptions } from './shared';
import { useCompile } from '@nocobase/client';
export const ReadPretty = observer(
  (props) => {
    const fieldNames = { ...defaultFieldNames, ...props.fieldNames };
    const field = useField();
    const compile = useCompile();
    if (!isValid(props.value)) {
      return React.createElement('div', null);
    }
    if (isArrayField(field) && field?.value?.length === 0) {
      return React.createElement('div', null);
    }
    const dataSource = field.dataSource || props.options || [];
    const options = getCurrentOptions(field.value, dataSource, fieldNames);
    return React.createElement(
      'div',
      null,
      options.map((option, key) =>
        React.createElement(
          Tag,
          { key: key, color: option[fieldNames.color], icon: option.icon },
          compile(option[fieldNames.label]),
        ),
      ),
    );
  },
  { displayName: 'ReadPretty' },
);
//# sourceMappingURL=ReadPretty.js.map
