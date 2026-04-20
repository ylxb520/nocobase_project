/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { uid } from '@formily/shared';
import { useForm, useField } from '@formily/react';
import {
  ActionContext,
  SchemaComponent,
  useAPIClient,
  useCompile,
  usePlugin,
  useResourceContext,
  useActionContext,
  useResourceActionContext,
} from '@nocobase/client';
import { Button, Dropdown, Empty } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PluginDatabaseConnectionsClient from '../';
import { useLoadCollections, useTestConnectionAction } from '../hooks';
import { NAMESPACE } from '../locale';
import { CollectionsTableField } from './CollectionsTableField';
const useCreateAction = (actionCallback) => {
  const form = useForm();
  const field = useField();
  const ctx = useActionContext();
  const { refresh } = useResourceActionContext();
  const { resource } = useResourceContext();
  return {
    async run() {
      try {
        await form.submit();
        field.data = field.data || {};
        field.data.loading = true;
        const collections = form.values.collections || [];
        const res = await resource.create({
          values: {
            ...form.values,
            collections: collections.filter((c) => c.selected).map((c) => c.name),
          },
        });
        ctx.setVisible(false);
        actionCallback?.(res?.data?.data);
        await form.reset();
        field.data.loading = false;
        refresh();
      } catch (error) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
};
export const CreateDatabaseConnectAction = () => {
  const [schema, setSchema] = useState({});
  const plugin = usePlugin(PluginDatabaseConnectionsClient);
  const compile = useCompile();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [dialect, setDialect] = useState(null);
  const api = useAPIClient();
  const loadCollections = useLoadCollections();
  const useDialectDataSource = (field) => {
    const options = [...plugin.types.keys()].map((key) => {
      const type = plugin.types.get(key);
      return {
        value: type.name,
        label: compile(type.label),
      };
    });
    field.dataSource = options;
  };
  return React.createElement(
    'div',
    null,
    React.createElement(
      ActionContext.Provider,
      { value: { visible, setVisible } },
      React.createElement(
        Dropdown,
        {
          menu: {
            onClick(info) {
              if (info.key === '__empty__') {
                return;
              }
              const type = plugin.types.get(info.key);
              setDialect(info.key);
              setVisible(true);
              setSchema({
                type: 'object',
                properties: {
                  [uid()]: {
                    type: 'void',
                    'x-component': 'Action.Drawer',
                    'x-component-props': {
                      width: 650,
                    },
                    'x-decorator': 'Form',
                    'x-decorator-props': {
                      initialValue: {
                        type: info.key,
                        key: `d_${uid()}`,
                      },
                    },
                    title: compile("{{t('Add new')}}") + ' - ' + compile(type.label),
                    properties: {
                      body: {
                        type: 'void',
                        'x-component': type.DataSourceSettingsForm.bind(null, {
                          CollectionsTableField,
                          loadCollections,
                          from: 'create',
                        }),
                      },
                      footer: {
                        type: 'void',
                        'x-component': 'Action.Drawer.Footer',
                        properties: {
                          testConnection: {
                            title: `{{ t("Test Connection",{ ns: "${NAMESPACE}" }) }}`,
                            'x-component': 'Action',
                            'x-component-props': {
                              useAction: '{{ useTestConnectionAction }}',
                            },
                            'x-hidden': type?.disableTestConnection,
                          },
                          cancel: {
                            title: '{{t("Cancel")}}',
                            'x-component': 'Action',
                            'x-component-props': {
                              useAction: '{{ cm.useCancelAction }}',
                            },
                          },
                          submit: {
                            title: '{{t("Submit")}}',
                            'x-component': 'Action',
                            'x-component-props': {
                              type: 'primary',
                              useAction: '{{ useCreateAction }}',
                              actionCallback: '{{ dataSourceCreateCallback }}',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            },
            items: [
              plugin.types.size
                ? null
                : {
                    key: '__empty__',
                    label: React.createElement(Empty, {
                      image: Empty.PRESENTED_IMAGE_SIMPLE,
                      description: React.createElement(
                        React.Fragment,
                        null,
                        t('No external data source plugin installed', { ns: NAMESPACE }),
                        React.createElement('br', null),
                        ' ',
                        React.createElement(
                          'a',
                          {
                            target: '_blank',
                            href:
                              api.auth.locale === 'zh-CN'
                                ? 'https://docs-cn.nocobase.com/handbook/data-source-manager'
                                : 'https://docs.nocobase.com/handbook/data-source-manager',
                            rel: 'noreferrer',
                          },
                          t('View documentation', { ns: NAMESPACE }),
                        ),
                      ),
                    }),
                  },
            ]
              .filter(Boolean)
              .concat(
                [...plugin.types.keys()].map((key) => {
                  const type = plugin.types.get(key);
                  return {
                    key: key,
                    label: compile(type?.label),
                  };
                }),
              ),
          },
        },
        React.createElement(
          Button,
          { type: 'primary', icon: React.createElement(PlusOutlined, null) },
          t('Add new'),
          ' ',
          React.createElement(DownOutlined, null),
        ),
      ),
      React.createElement(SchemaComponent, {
        scope: {
          createOnly: false,
          useTestConnectionAction,
          dialect,
          useDialectDataSource,
          useCreateAction,
        },
        schema: schema,
      }),
    ),
  );
};
//# sourceMappingURL=CreateDatabaseConnectAction.js.map
