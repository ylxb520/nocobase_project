/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { RecursionField, useForm, FormProvider } from '@formily/react';
import { Spin, Table } from 'antd';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createForm } from '@formily/core';
import { SchemaOptionsContext } from '@formily/react';
import {
  EllipsisWithTooltip,
  useCompile,
  useAPIClient,
  useCollectionManager_deprecated,
  SchemaComponentOptions,
} from '@nocobase/client';
const mapFields = ['lineString', 'point', 'circle', 'polygon'];
export const PreviewTable = (props) => {
  const { remoteServerName, remoteTableName, fields } = props;
  const [previewColumns, setPreviewColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const schemaOptions = useContext(SchemaOptionsContext);
  const compile = useCompile();
  const [loading, setLoading] = useState(false);
  const { getInterface } = useCollectionManager_deprecated();
  const api = useAPIClient();
  const { t } = useTranslation();
  const form = useForm();
  useEffect(() => {
    if (remoteServerName && remoteTableName) {
      getPreviewData();
    } else {
      setPreviewColumns([]);
    }
  }, [remoteTableName]);
  useEffect(() => {
    setPreviewColumns([]);
    const pColumns = formatPreviewColumns(fields);
    setTimeout(() => {
      setPreviewColumns(pColumns);
    });
  }, [form.values.fields]);
  const getPreviewData = () => {
    const fieldTypes = {};
    form.values.fields.map((v) => {
      if (mapFields.includes(v.type)) {
        fieldTypes[v.name] = v.type;
      }
    });
    setLoading(true);
    api
      .resource('databaseServers.tables', remoteServerName)
      .query({ filterByTk: remoteTableName, fieldTypes })
      .then(({ data }) => {
        if (data) {
          setLoading(false);
          setPreviewData(data?.data || []);
        }
      }).catch;
  };
  const formatPreviewColumns = (data) => {
    return data
      .filter((k) => k.interface)
      ?.map((item) => {
        const target = item?.uiSchema?.title || item.name;
        const schema = getInterface(item.interface)?.default?.uiSchema || {};
        return {
          title: compile(target),
          dataIndex: item.name,
          key: item.name,
          width: 200,
          render: (text, record, index) => {
            const content = record[item.name];
            const objSchema = {
              type: 'object',
              properties: {
                [`${item.name}_${index}`]: {
                  ...schema,
                  'x-read-pretty': true,
                  default: item.interface === 'json' ? JSON.stringify(content) : content,
                },
              },
            };
            return React.createElement(
              EllipsisWithTooltip,
              { ellipsis: true },
              React.createElement(
                SchemaComponentOptions,
                { components: schemaOptions.components },
                React.createElement(RecursionField, { schema: objSchema, name: index, onlyRenderProperties: true }),
              ),
            );
          },
        };
      });
  };
  const previewForm = useMemo(
    () =>
      createForm({
        readPretty: true,
        readOnly: true,
      }),
    [previewColumns],
  );
  return React.createElement(
    Spin,
    { spinning: loading, key: 'preview' },
    React.createElement(
      'div',
      {
        style: {
          marginBottom: 22,
        },
      },
      React.createElement(
        'div',
        {
          className: 'ant-formily-item-label',
          style: { marginTop: 24, display: 'flex', padding: '0 0 8px' },
          key: remoteServerName,
        },
        React.createElement(
          'div',
          { className: 'ant-formily-item-label-content' },
          React.createElement('span', null, React.createElement('label', null, t('Preview'))),
        ),
        React.createElement('span', { className: 'ant-formily-item-colon' }, ':'),
      ),
      previewColumns?.length > 0 &&
        React.createElement(
          FormProvider,
          { form: previewForm },
          React.createElement(Table, {
            size: 'middle',
            pagination: false,
            bordered: true,
            columns: previewColumns,
            dataSource: previewData,
            scroll: { x: 1000, y: 300 },
            key: `${remoteServerName}-preview`,
          }),
        ),
    ),
  );
};
//# sourceMappingURL=PreviewTable.js.map
