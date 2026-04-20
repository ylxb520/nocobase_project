/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Tabs } from 'antd';
import { DatabaseOutlined, FileTextOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { useT } from '../../../locale';
import { CodeInternal } from '../../chatbox/markdown/Code';
import { Diagram } from './Diagram';
import { Table } from './Table';
import { useApp } from '@nocobase/client';
import { useChatToolsStore } from '../../chatbox/stores/chat-tools';
const useCollections = (collections) => {
  const app = useApp();
  const fim = app.dataSourceManager.collectionFieldInterfaceManager;
  return useMemo(() => {
    const result = [];
    for (const collection of collections) {
      const fields =
        collection.fields?.map((field) => {
          const fieldInterface = fim.getFieldInterface(field.interface);
          if (fieldInterface) {
            field.type = field.type || fieldInterface.default?.type;
            field.uiSchema = field.uiSchema || fieldInterface.default?.uiSchema;
          }
          field.uiSchema = {
            ...field.uiSchema,
            title: field.title,
          };
          if (field.enum) {
            field.uiSchema = {
              ...field.uiSchema,
              enum: field.enum,
            };
          }
          return field;
        }) || [];
      result.push({
        ...collection,
        hidden: false,
        fields,
      });
    }
    return result;
  }, [collections]);
};
const TabPane = ({ children }) => {
  return React.createElement(
    'div',
    {
      style: {
        height: '70vh',
        overflowY: 'auto',
      },
    },
    children,
  );
};
const useUpdateTool = (tool, saveToolArgs) => {
  const updateCollectionRecord = useCallback(
    async (collectionIndex, collection) => {
      const collections = [...tool.args.collections];
      if (!collections[collectionIndex]) {
        return;
      }
      collections[collectionIndex] = {
        ...collections[collectionIndex],
        ...collection,
      };
      saveToolArgs({ ...tool.args, collections });
    },
    [tool, saveToolArgs],
  );
  const updateFieldRecord = useCallback(
    async (collectionIndex, fieldIndex, field) => {
      const collections = [...tool.args.collections];
      if (!collections[collectionIndex]?.fields?.[fieldIndex]) {
        return;
      }
      const oldField = collections[collectionIndex].fields[fieldIndex];
      collections[collectionIndex].fields[fieldIndex] = {
        ...oldField,
        ...field,
      };
      saveToolArgs({ ...tool.args, collections });
    },
    [tool, saveToolArgs],
  );
  return {
    updateCollectionRecord,
    updateFieldRecord,
  };
};
export const DataModelingModal = ({ tool, saveToolArgs }) => {
  const t = useT();
  const collectionTypeStr = typeof tool.args.collections;
  const collections = useCollections(
    collectionTypeStr === 'string' ? JSON.parse(tool.args.collections) : tool.args.collections,
  );
  const setAdjustArgs = useChatToolsStore.use.setAdjustArgs();
  const { updateCollectionRecord, updateFieldRecord } = useUpdateTool(tool, saveToolArgs);
  useEffect(() => {
    setAdjustArgs({
      ...tool.args,
      collections,
    });
  }, [tool.args, tool.args.collections, setAdjustArgs]);
  const items = [
    {
      key: 'collections',
      label: t('Collections'),
      icon: React.createElement(DatabaseOutlined, null),
      children: React.createElement(Table, {
        collections: collections,
        updateCollectionRecord: updateCollectionRecord,
        updateFieldRecord: updateFieldRecord,
      }),
    },
    {
      key: 'graph',
      icon: React.createElement(NodeIndexOutlined, null),
      label: t('Diagram'),
      children: React.createElement(TabPane, null, React.createElement(Diagram, { collections: collections })),
    },
    {
      key: 'definition',
      icon: React.createElement(FileTextOutlined, null),
      label: 'Definition',
      children: React.createElement(
        TabPane,
        null,
        React.createElement(CodeInternal, { language: 'json', value: JSON.stringify(collections, null, 2) }),
      ),
    },
  ];
  return React.createElement(Tabs, { defaultActiveKey: '1', items: items });
};
//# sourceMappingURL=DataModelingModal.js.map
