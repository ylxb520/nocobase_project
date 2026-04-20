/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { connect, mapProps, mapReadPretty } from '@formily/react';
import { Input as AntdInput } from 'antd';
import cls from 'classnames';
import { useCollectionRecord } from '@nocobase/client';
import { usePrefixCls } from '@formily/antd-v5/esm/__builtins__';
const ReadPretty = (props) => {
  const prefixCls = usePrefixCls('description-input', props);
  const {
    data: { name, tableName },
  } = useCollectionRecord();
  return React.createElement(
    'div',
    { className: cls(prefixCls, props.className), style: props.style },
    name !== tableName && tableName
      ? React.createElement(
          React.Fragment,
          null,
          name,
          ' ',
          React.createElement('span', { style: { color: 'GrayText' } }, '(', tableName, ')'),
        )
      : props.value,
  );
};
export const CollectionName = Object.assign(
  connect(
    AntdInput,
    mapProps((props, field) => {
      return {
        ...props,
        suffix: React.createElement(
          'span',
          null,
          field?.['loading'] || field?.['validating'] ? React.createElement(LoadingOutlined, null) : props.suffix,
        ),
      };
    }),
    mapReadPretty(ReadPretty),
  ),
);
//# sourceMappingURL=CollectionName.js.map
