/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FormLayout } from '@formily/antd-v5';
import { Schema, SchemaOptionsContext, observer, useField, useForm } from '@formily/react';
import {
  APIClientProvider,
  FormDialog,
  FormProvider,
  NocoBaseRecursionField,
  SchemaComponent,
  SchemaComponentOptions,
  css,
  useAPIClient,
  useCompile,
  useGlobalTheme,
  useSchemaInitializer,
} from '@nocobase/client';
import { Card } from 'antd';
import JSON5 from 'json5';
import React, { useContext, useEffect, useState } from 'react';
import { jsonConfigDesc } from './ChartBlockEngineDesigner';
import { ChartQueryBlockInitializer } from './ChartQueryBlockInitializer';
import DataSetPreviewTable from './DataSetPreviewTable';
import { lang } from './locale';
import { templates } from './templates';
export const Options = observer(
  (props) => {
    const form = useForm();
    const field = useField();
    const [s, setSchema] = useState(new Schema({}));
    const [chartType, setChartType] = useState(form.values.type);
    useEffect(() => {
      // form.clearFormGraph('options.*');
      setChartType(form?.values?.type);
      if (chartType !== form?.values?.type) {
        form.clearFormGraph('options.*');
      }
      if (form.values.type) {
        const template = templates.get(form.values.type);
        setSchema(new Schema(template.configurableProperties || {}));
      }
    }, [form.values.type]);
    return React.createElement(NocoBaseRecursionField, { schema: s });
  },
  { displayName: 'Options' },
);
export const ChartBlockInitializer = (props) => {
  const { insert } = useSchemaInitializer();
  const options = useContext(SchemaOptionsContext);
  const api = useAPIClient();
  const compile = useCompile();
  const { theme } = useGlobalTheme();
  return React.createElement(ChartQueryBlockInitializer, {
    ...props,
    componentType: 'Charts',
    onCreateBlockSchema: async ({ item: chartQueryMetadata }) => {
      const dataSource = chartQueryMetadata?.fields.map((field) => {
        return {
          label: field.name,
          value: field.name,
        };
      });
      const values = await FormDialog(
        {
          okText: compile('{{t("Submit")}}'),
          title: lang('Create chart block'),
          width: 1200,
          bodyStyle: { background: 'var(--nb-box-bg)', maxHeight: '65vh', overflow: 'auto' },
        },
        function Com() {
          const form = useForm();
          const [chartBlockEngineMetaData, setChartBlockEngineMetaData] = useState(null);
          useEffect(() => {
            const chartBlockEngineMetaData = {
              query: {
                id: chartQueryMetadata?.id,
              },
              chart: form.values, //TODO
            };
            setChartBlockEngineMetaData(chartBlockEngineMetaData);
          }, [form.values.type]);
          return React.createElement(
            APIClientProvider,
            { apiClient: api },
            React.createElement(
              SchemaComponentOptions,
              { scope: options.scope, components: { ...options.components } },
              React.createElement(
                'section',
                {
                  className: css`
                    display: flex;
                    gap: 24px;
                  `,
                },
                React.createElement(
                  Card,
                  {
                    title: lang('Chart config'),
                    size: 'default',
                    className: css`
                      flex: 1;
                    `,
                  },
                  React.createElement(
                    FormProvider,
                    { form: form },
                    React.createElement(
                      FormLayout,
                      { layout: 'vertical' },
                      React.createElement(SchemaComponent, {
                        scope: { dataSource, JSON5, jsonConfigDesc },
                        components: { Options },
                        schema: {
                          properties: {
                            // title: {
                            //   title: lang('Chart title'),
                            //   'x-component': 'Input',
                            //   'x-decorator': 'FormItem',
                            // },
                            type: {
                              title: lang('Chart type'),
                              required: true,
                              'x-component': 'CustomSelect',
                              'x-decorator': 'FormItem',
                              enum: [...templates.values()].map((template) => {
                                return {
                                  title: template.title,
                                  key: template.type,
                                  description: template.description,
                                  group: template.group,
                                  iconId: template.iconId,
                                };
                              }),
                            },
                            options: {
                              type: 'void',
                              'x-component': 'Options',
                            },
                          },
                        },
                      }),
                    ),
                  ),
                ),
                React.createElement(
                  'div',
                  {
                    className: css`
                      flex: 1;
                      min-width: 600px;
                    `,
                  },
                  React.createElement(
                    Card,
                    { size: 'default', title: lang('Chart preview') },
                    chartBlockEngineMetaData &&
                      React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(SchemaComponent, {
                          schema: {
                            properties: {
                              chartPreview: {
                                type: 'void',
                                'x-decorator': 'CardItem',
                                'x-component': 'ChartBlockEngine',
                                'x-component-props': {
                                  chartBlockEngineMetaData,
                                },
                              },
                            },
                          },
                        }),
                      ),
                  ),
                  React.createElement(
                    Card,
                    {
                      size: 'default',
                      title: lang('Data preview'),
                      className: css`
                        margin-top: 24px;
                        overflow: scroll;
                      `,
                    },
                    chartBlockEngineMetaData?.query?.id &&
                      React.createElement(DataSetPreviewTable, {
                        queryId: chartBlockEngineMetaData?.query?.id,
                        fields: chartQueryMetadata?.fields,
                      }),
                  ),
                ),
              ),
            ),
          );
        },
        theme,
      ).open({
        initialValues: {},
      });
      if (values) {
        const chartBlockEngineMetaData = {
          query: {
            id: chartQueryMetadata.id,
          },
          chart: values,
        };
        insert({
          type: 'void',
          title: values?.title,
          'x-designer': 'ChartBlockEngine.Designer',
          'x-decorator': 'CardItem',
          'x-component': 'ChartBlockEngine',
          'x-component-props': {
            chartBlockEngineMetaData,
          },
        });
      }
    },
  });
};
//# sourceMappingURL=ChartBlockInitializer.js.map
