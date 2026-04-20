/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FormLayout } from '@formily/antd-v5';
import { SchemaOptionsContext, useField, useFieldSchema } from '@formily/react';
import {
  APIClientProvider,
  FormDialog,
  GeneralSchemaDesigner,
  SchemaComponent,
  SchemaComponentOptions,
  SchemaSettingsDivider,
  SchemaSettingsItem,
  SchemaSettingsRemove,
  css,
  i18n,
  useAPIClient,
  useCompile,
  useDesignable,
  useGlobalTheme,
} from '@nocobase/client';
import { error } from '@nocobase/utils/client';
import { Card } from 'antd';
import JSON5 from 'json5';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Options } from './ChartBlockInitializer';
import DataSetPreviewTable from './DataSetPreviewTable';
import { useFieldsById } from './hooks';
import { lang } from './locale';
import { templates } from './templates';
import _ from 'lodash';
export const jsonConfigDesc = (title, link) => {
  return React.createElement(
    'span',
    null,
    lang('Json config references: '),
    React.createElement('a', { href: link, target: '_blank', rel: 'noreferrer' }, lang(title)),
  );
};
const validateJSON = {
  validator: `{{(value, rule)=> {
    if (!value) {
      return '';
    }
    try {
      const val = JSON.parse(value);
      if(!isNaN(val)) {
        return false;
      }
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }}}`,
  message: '{{t("Invalid JSON format",{ ns: "charts" })}}',
};
export const ChartBlockEngineDesigner = () => {
  const fieldSchema = useFieldSchema();
  const { chartBlockEngineMetaData } = fieldSchema?.['x-component-props'] || {};
  return React.createElement(
    GeneralSchemaDesigner,
    null,
    React.createElement(ChartBlockEngineDesignerInitializer, { chartBlockEngineMetaData: chartBlockEngineMetaData }),
    React.createElement(SchemaSettingsDivider, null),
    React.createElement(SchemaSettingsRemove, {
      removeParentsIfNoChildren: true,
      breakRemoveOn: {
        'x-component': 'Grid',
      },
    }),
  );
};
export const ChartBlockEngineDesignerInitializer = (props) => {
  const { chartBlockEngineMetaData } = props;
  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  const { dn } = useDesignable();
  const fieldSchema = useFieldSchema();
  const api = useAPIClient();
  const field = useField();
  const compile = useCompile();
  const { chart, query } = chartBlockEngineMetaData;
  const { fields } = useFieldsById(query.id);
  const { theme } = useGlobalTheme();
  const dataSource = fields.map((field) => {
    return {
      label: field.name,
      value: field.name,
    };
  });
  return React.createElement(
    SchemaSettingsItem,
    {
      title: props.title || 'Edit chart block',
      onClick: async () => {
        FormDialog(
          {
            okText: compile('{{t("Submit")}}'),
            title: lang('Edit chart block'),
            width: 1200,
            bodyStyle: { background: 'var(--nb-box-bg)', maxHeight: '65vh', overflow: 'auto' },
          },
          function Com(form) {
            const [chartBlockEngineMetaData, setChartBlockEngineMetaData] = useState(null);
            useEffect(() => {
              const chartBlockEngineMetaData = {
                query: {
                  id: query?.id,
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
                      bordered: false,
                      title: i18n.t('Chart config'),
                      size: 'default',
                      className: css`
                        flex: 1;
                      `,
                    },
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
                              title: t('Chart type'),
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
                                    chartBlockEngineMetaData: chartBlockEngineMetaData,
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
                          fields: fields,
                        }),
                    ),
                  ),
                ),
              ),
            );
          },
          theme,
        )
          .open({
            initialValues: { ...chart }, //reset before chartBlockMetaData
          })
          .then((values) => {
            //patch updates
            values = {
              query,
              chart: values,
            };
            field.title = values.chart.title;
            fieldSchema['title'] = values.chart.title;
            field.componentProps.chartBlockEngineMetaData = values;
            _.set(fieldSchema, 'x-component-props.chartBlockEngineMetaData', values);
            dn.emit('patch', {
              schema: {
                'x-uid': fieldSchema['x-uid'],
                'x-component-props': fieldSchema['x-component-props'],
              },
            });
            dn.refresh();
          })
          .catch((err) => {
            error(err);
          });
      },
    },
    props.children || props.title || lang('Edit chart block'),
  );
};
//# sourceMappingURL=ChartBlockEngineDesigner.js.map
