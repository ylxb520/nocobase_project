/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo, useState } from 'react';
import { Modal, App } from 'antd';
import { createForm } from '@formily/core';
import { Schema, useForm, observer } from '@formily/react';
import { uid } from '@formily/shared';
import { ActionContextProvider, SchemaComponent, useAPIClient, useActionContext, useRequest } from '@nocobase/client';
import { useT } from '../../locale';
import { LLMProvidersContext } from '../../llm-services/llm-providers';
import { ProviderSelect, useProviderSettingsForm } from '../../llm-services/LLMServices';
import { LLMTestFlight } from '../../llm-services/component/LLMTestFlight';
import { EnabledModelsSelect } from '../../llm-services/component/EnabledModelsSelect';
const ModalSettings = observer(
  () => {
    const form = useForm();
    const Component = useProviderSettingsForm(form.values.provider);
    return Component ? React.createElement(Component, null) : null;
  },
  { displayName: 'ModalSettings' },
);
const useCreateFormProps = () => {
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          name: `v_${uid()}`,
        },
      }),
    [],
  );
  return { form };
};
const useCancelActionProps = () => {
  const { setVisible } = useActionContext();
  return {
    type: 'default',
    onClick() {
      setVisible(false);
    },
  };
};
const modalSchema = {
  type: 'void',
  properties: {
    form: {
      type: 'void',
      'x-decorator': 'FormV2',
      'x-use-decorator-props': 'useCreateFormProps',
      properties: {
        provider: {
          type: 'string',
          'x-decorator': 'FormItem',
          title: '{{ t("Provider") }}',
          'x-component': 'ProviderSelect',
          required: true,
        },
        title: {
          type: 'string',
          'x-decorator': 'FormItem',
          title: '{{ t("Title") }}',
          'x-component': 'Input',
          'x-reactions': {
            dependencies: ['provider'],
            when: '{{!$self.modified}}',
            fulfill: {
              state: {
                value: '{{$getProviderLabel($deps[0])}}',
              },
              schema: {
                'x-visible': '{{!!$deps[0]}}',
              },
            },
          },
        },
        options: {
          type: 'object',
          'x-component': 'ModalSettings',
          'x-reactions': {
            dependencies: ['provider'],
            fulfill: {
              schema: {
                'x-visible': '{{!!$deps[0]}}',
              },
            },
          },
        },
        'options.baseURL': {
          type: 'string',
          'x-decorator': 'FormItem',
          title: '{{ t("Base URL") }}',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '{{ t("Base URL is optional, leave blank to use default (recommended)") }}',
          },
          'x-reactions': {
            dependencies: ['provider'],
            fulfill: {
              schema: {
                'x-visible': '{{!!$deps[0]}}',
              },
            },
          },
        },
        enabledModels: {
          type: 'object',
          'x-decorator': 'FormItem',
          title: '{{ t("Enabled Models") }}',
          'x-component': 'EnabledModelsSelect',
          'x-reactions': {
            dependencies: ['provider'],
            fulfill: {
              schema: {
                'x-visible': '{{!!$deps[0]}}',
              },
            },
          },
        },
        footer: {
          type: 'void',
          'x-component': 'Space',
          'x-component-props': {
            style: { display: 'flex', justifyContent: 'flex-end' },
          },
          properties: {
            testFlight: {
              type: 'void',
              'x-component': 'LLMTestFlight',
              'x-reactions': {
                dependencies: ['provider'],
                fulfill: {
                  schema: {
                    'x-visible': '{{!!$deps[0]}}',
                  },
                },
              },
            },
            cancel: {
              title: '{{ t("Cancel") }}',
              'x-component': 'Action',
              'x-use-component-props': 'useCancelActionProps',
            },
            submit: {
              title: '{{ t("Submit") }}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
              },
              'x-use-component-props': 'useModalCreateActionProps',
            },
          },
        },
      },
    },
  },
};
export const AddLLMModal = ({ open, onClose, onSuccess }) => {
  const t = useT();
  const api = useAPIClient();
  const [providers, setProviders] = useState([]);
  const [formKey, setFormKey] = useState(0);
  useRequest(
    () =>
      api
        .resource('ai')
        .listLLMProviders()
        .then((res) => {
          const data = res?.data?.data || [];
          return data.map((provider) => ({
            key: provider.name,
            label: Schema.compile(provider.title || provider.name, { t }),
            value: provider.name,
            supportedModel: provider.supportedModel,
          }));
        }),
    {
      onSuccess: (data) => {
        setProviders(data);
      },
    },
  );
  const $getProviderLabel = (providerValue) => {
    const provider = providers.find((p) => p.value === providerValue);
    return provider?.label || providerValue;
  };
  const handleSetVisible = (visible) => {
    if (!visible) {
      onClose();
      setFormKey((k) => k + 1);
    }
  };
  const useModalCreateActionProps = () => {
    const { setVisible } = useActionContext();
    const { message } = App.useApp();
    const form = useForm();
    const innerApi = useAPIClient();
    const innerT = useT();
    return {
      type: 'primary',
      async onClick() {
        await form.submit();
        const values = form.values;
        await innerApi.resource('llmServices').create({ values });
        message.success(innerT('Saved successfully'));
        setVisible(false);
        onSuccess();
      },
    };
  };
  return React.createElement(
    LLMProvidersContext.Provider,
    { value: { providers } },
    React.createElement(
      ActionContextProvider,
      { value: { visible: open, setVisible: handleSetVisible } },
      React.createElement(
        Modal,
        { title: t('Add LLM service'), open: open, onCancel: onClose, footer: null, destroyOnClose: true, width: 600 },
        React.createElement(SchemaComponent, {
          key: formKey,
          schema: modalSchema,
          components: {
            ProviderSelect,
            ModalSettings,
            LLMTestFlight,
            EnabledModelsSelect,
          },
          scope: {
            useCreateFormProps,
            useCancelActionProps,
            useModalCreateActionProps,
            $getProviderLabel,
            providers,
          },
        }),
      ),
    ),
  );
};
//# sourceMappingURL=AddLLMModal.js.map
