/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Handle, Position } from 'reactflow';
import { List, Card, Flex } from 'antd';
import { useApp, useToken } from '@nocobase/client';
import { useT } from '../../../locale';
import { Schema } from '@formily/react';
import { KeyOutlined } from '@ant-design/icons';
export const CollectionNode = ({ data }) => {
  const { token } = useToken();
  const app = useApp();
  const t = useT();
  const fim = app.dataSourceManager.collectionFieldInterfaceManager;
  const handleStyle = {
    top: '50%',
    transform: 'translateY(-50%)',
    width: 8,
    height: 8,
    opacity: 0,
    pointerEvents: 'none',
  };
  return React.createElement(
    Card,
    {
      size: 'small',
      title: React.createElement(
        'div',
        {
          style: {
            position: 'relative',
          },
        },
        React.createElement(Handle, { type: 'target', position: Position.Left, id: data.name, style: handleStyle }),
        data.title,
        ' ',
        React.createElement(
          'span',
          {
            style: {
              fontSize: token.fontSizeSM,
              color: token.colorTextDescription,
            },
          },
          data.name,
        ),
        React.createElement(Handle, { type: 'source', position: Position.Right, id: data.name, style: handleStyle }),
      ),
      styles: {
        body: {
          padding: 0,
          minWidth: '200px',
        },
      },
    },
    React.createElement(List, {
      dataSource: data.fields,
      size: 'small',
      renderItem: (item) => {
        const fieldInterface = fim.getFieldInterface(item.interface);
        return React.createElement(
          List.Item,
          {
            style: {
              position: 'relative', // 为了定位 Handle
            },
          },
          React.createElement(
            Flex,
            {
              justify: 'space-between',
              gap: 'large',
              style: {
                width: '100%',
              },
            },
            React.createElement(Handle, {
              type: 'source',
              position: Position.Right,
              id: `${data.name}-${item.name}`,
              style: handleStyle,
            }),
            React.createElement(
              Flex,
              { vertical: true },
              React.createElement(
                'div',
                null,
                item.title,
                item.primaryKey
                  ? React.createElement(KeyOutlined, {
                      style: {
                        marginLeft: '4px',
                      },
                    })
                  : '',
              ),
              React.createElement(
                'div',
                {
                  style: {
                    fontSize: token.fontSizeSM,
                    color: token.colorTextDescription,
                  },
                },
                item.name,
              ),
            ),
            React.createElement(
              Flex,
              { vertical: true, align: 'flex-end' },
              React.createElement(
                'div',
                {
                  style: {
                    fontSize: token.fontSizeSM,
                    color: token.colorTextSecondary,
                  },
                },
                fieldInterface?.title ? Schema.compile(fieldInterface.title, { t }) : '',
              ),
              React.createElement(
                'div',
                {
                  style: {
                    fontSize: token.fontSizeSM,
                    color: token.colorTextDescription,
                  },
                },
                item.type,
              ),
            ),
          ),
        );
      },
    }),
  );
};
//# sourceMappingURL=CollectionNode.js.map
