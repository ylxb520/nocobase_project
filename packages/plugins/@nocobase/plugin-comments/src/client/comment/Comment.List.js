/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { RecursionField, Schema, useField, useFieldSchema } from '@formily/react';
import { List as AntdList, Spin } from 'antd';
import React, { useCallback, useState } from 'react';
import useStyles from './style';
import { useBlockRequestContext, withDynamicSchemaProps } from '@nocobase/client';
const InternalCommentList = (props) => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const [schemaMap] = useState(new Map());
  const { wrapSSR, hashId, componentCls } = useStyles();
  const { service } = useBlockRequestContext();
  const { run, params } = service;
  const meta = service?.data?.meta;
  const getSchema = useCallback(
    (key) => {
      if (!schemaMap.has(key)) {
        schemaMap.set(
          key,
          new Schema({
            type: 'object',
            properties: {
              [key]: fieldSchema.properties['item'],
            },
          }),
        );
      }
      return schemaMap.get(key);
    },
    [fieldSchema.properties, schemaMap],
  );
  const onPaginationChange = useCallback(
    (page, pageSize) => {
      run({
        ...params?.[0],
        page: page,
        pageSize: pageSize,
      });
    },
    [run, params],
  );
  if (service?.loading) {
    return React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'center' } },
      React.createElement(Spin, { spinning: true }),
    );
  }
  return wrapSSR(
    React.createElement(
      'div',
      { className: `${componentCls} ${hashId}` },
      React.createElement(
        AntdList,
        {
          ...props,
          pagination:
            meta?.count > 0
              ? {
                  onChange: onPaginationChange,
                  total: meta?.count || 0,
                  pageSize: meta?.pageSize || 10,
                  current: meta?.page || 1,
                }
              : false,
        },
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
            },
          },
          field.value?.length
            ? field.value.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === field.value.length - 1;
                return React.createElement(
                  'div',
                  {
                    key: index,
                    style: {
                      position: 'relative',
                      padding: `${isFirst ? 0 : '10px'} 0 ${isLast ? 0 : '10px'} 0`,
                    },
                  },
                  React.createElement(RecursionField, {
                    basePath: field.address,
                    name: index,
                    onlyRenderProperties: true,
                    schema: getSchema(index),
                  }),
                );
              })
            : null,
        ),
      ),
    ),
  );
};
export const CommentList = withDynamicSchemaProps(InternalCommentList);
//# sourceMappingURL=Comment.List.js.map
