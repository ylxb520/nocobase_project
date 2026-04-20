/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  ActionContextProvider,
  ExtendCollectionsProvider,
  SchemaComponent,
  useAPIClient,
  useActionContext,
  useCollection,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
  useDestroyActionProps,
  useBulkDestroyActionProps,
  usePlugin,
  useRequest,
} from '@nocobase/client';
import React, { useMemo, useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useT } from '../locale';
// Context for auto-open drawer functionality
const AutoOpenContext = createContext({
  autoOpen: false,
  setAutoOpen: () => {},
});
import { Button, App, theme, Select, Switch, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import llmServices from '../../collections/llm-services';
import { llmsSchema, createLLMSchema } from '../schemas/llms';
import { LLMProvidersContext, useLLMProviders } from './llm-providers';
import { Schema, useForm, observer, useField } from '@formily/react';
import { createForm } from '@formily/core';
import { uid } from '@formily/shared';
import { LLMTestFlight } from './component/LLMTestFlight';
import { EnabledModelsSelect } from './component/EnabledModelsSelect';
import { ModelOptionsSettings } from './component/ModelOptionsSettings';
import { useAIConfigRepository } from '../repositories/hooks/useAIConfigRepository';
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
  return {
    form,
  };
};
const useEditFormProps = () => {
  const record = useCollectionRecordData();
  const form = useMemo(
    () =>
      createForm({
        initialValues: record,
      }),
    [record],
  );
  return {
    form,
  };
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
const useCreateActionProps = () => {
  const { setVisible } = useActionContext();
  const { message } = App.useApp();
  const form = useForm();
  const resource = useDataBlockResource();
  const { refresh } = useDataBlockRequest();
  const t = useT();
  const llmServicesRepo = useAIConfigRepository();
  return {
    type: 'primary',
    async onClick() {
      await form.submit();
      const values = form.values;
      await resource.create({
        values,
      });
      refresh();
      llmServicesRepo.refreshLLMServices();
      message.success(t('Saved successfully'));
      setVisible(false);
    },
  };
};
const useEditActionProps = () => {
  const { setVisible } = useActionContext();
  const { message } = App.useApp();
  const form = useForm();
  const resource = useDataBlockResource();
  const { refresh } = useDataBlockRequest();
  const collection = useCollection();
  const filterTk = collection.getFilterTargetKey();
  const t = useT();
  const llmServicesRepo = useAIConfigRepository();
  return {
    type: 'primary',
    async onClick() {
      await form.submit();
      const values = form.values;
      await resource.update({
        values,
        filterByTk: values[filterTk],
      });
      refresh();
      llmServicesRepo.refreshLLMServices();
      message.success(t('Saved successfully'));
      setVisible(false);
      form.reset();
    },
  };
};
const providerDescriptions = {
  'google-genai': 'Gemini',
  openai: 'GPT',
  'openai-completions': 'Recommended for third-party OpenAI-compatible APIs (OpenRouter, Groq, Together AI, etc.)',
  anthropic: 'Claude',
  deepseek: 'DeepSeek',
  dashscope: 'Qwen (Tongyi)',
  kimi: 'Kimi',
  ollama: 'Local models',
};
const providerSortOrder = [
  'google-genai',
  'openai',
  'anthropic',
  'deepseek',
  'dashscope',
  'kimi',
  'openai-completions',
  'ollama',
];
const ProviderDisplay = () => {
  const field = useField();
  const providers = useLLMProviders();
  const provider = providers.find((p) => p.value === field.value);
  return React.createElement('span', null, provider?.label || field.value);
};
export const ProviderSelect = () => {
  const { token } = theme.useToken();
  const field = useField();
  const providers = useLLMProviders();
  const t = useT();
  const sortedProviders = [...providers].sort((a, b) => {
    const ai = providerSortOrder.indexOf(a.value);
    const bi = providerSortOrder.indexOf(b.value);
    // Unlisted providers sort to the end
    return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
  });
  const options = sortedProviders.map((item) => {
    const descKey = providerDescriptions[item.value];
    const description = descKey ? t(descKey) : '';
    const supported = item.supportedModel || [];
    const capabilities = [
      supported.includes('LLM') ? 'LLM' : null,
      supported.includes('EMBEDDING') ? 'EMBEDDING' : null,
    ].filter(Boolean);
    return {
      value: item.value,
      label: React.createElement(
        'div',
        null,
        React.createElement('div', { style: { fontWeight: 500 } }, item.label),
        React.createElement(
          'div',
          {
            style: {
              fontSize: token.fontSizeSM,
              color: token.colorTextTertiary,
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: token.marginXS,
            },
          },
          React.createElement('span', null, description),
          React.createElement(
            'span',
            { style: { display: 'inline-flex', alignItems: 'center', gap: token.marginXXS, flexWrap: 'wrap' } },
            capabilities.map((capability) =>
              React.createElement(
                Tag,
                {
                  key: capability,
                  bordered: false,
                  color: 'default',
                  style: {
                    marginInlineEnd: 0,
                    paddingInline: 6,
                    lineHeight: '18px',
                    height: 18,
                    fontSize: 11,
                  },
                },
                capability,
              ),
            ),
          ),
        ),
      ),
      selectedLabel: item.label,
    };
  });
  return React.createElement(Select, {
    value: field.value,
    onChange: (val) => (field.value = val),
    options: options,
    optionLabelProp: 'selectedLabel',
    style: { width: '100%' },
    listHeight: 400,
  });
};
const EnabledSwitch = observer(
  () => {
    const field = useField();
    const record = useCollectionRecordData();
    const resource = useDataBlockResource();
    const { refresh } = useDataBlockRequest();
    const collection = useCollection();
    const filterTk = collection.getFilterTargetKey();
    const checked = field.value !== false;
    const llmServicesRepo = useAIConfigRepository();
    return React.createElement(Switch, {
      size: 'small',
      checked: checked,
      onChange: async (val) => {
        field.value = val;
        await resource.update({
          values: { enabled: val },
          filterByTk: record[filterTk],
        });
        refresh();
        llmServicesRepo.refreshLLMServices();
      },
    });
  },
  { displayName: 'EnabledSwitch' },
);
const useLLMDestroyActionProps = () => {
  const props = useDestroyActionProps();
  const llmServicesRepo = useAIConfigRepository();
  return {
    ...props,
    async onClick(e, callBack) {
      await props.onClick(e, callBack);
      llmServicesRepo.refreshLLMServices();
    },
  };
};
const useLLMBulkDestroyActionProps = () => {
  const props = useBulkDestroyActionProps();
  const llmServicesRepo = useAIConfigRepository();
  return {
    ...props,
    async onClick(e, callBack) {
      await props.onClick(e, callBack);
      llmServicesRepo.refreshLLMServices();
    },
  };
};
const AddNew = () => {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const providers = useLLMProviders();
  const { autoOpen, setAutoOpen } = useContext(AutoOpenContext);
  useEffect(() => {
    if (autoOpen) {
      setFormKey((k) => k + 1);
      setVisible(true);
      setAutoOpen(false);
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [autoOpen, setAutoOpen]);
  const handleClick = () => {
    setFormKey((k) => k + 1);
    setVisible(true);
  };
  const $getProviderLabel = (providerValue) => {
    const provider = providers.find((p) => p.value === providerValue);
    return provider?.label || providerValue;
  };
  return React.createElement(
    ActionContextProvider,
    { value: { visible, setVisible } },
    React.createElement(
      Button,
      { icon: React.createElement(PlusOutlined, null), type: 'primary', onClick: handleClick },
      t('Add new'),
    ),
    React.createElement(SchemaComponent, {
      key: formKey,
      components: { LLMTestFlight, EnabledModelsSelect, ProviderSelect, ModelOptionsSettings },
      scope: { useCreateFormProps, providers, $getProviderLabel },
      schema: createLLMSchema,
    }),
  );
};
// Get the ProviderSettingsForm component for the current provider
export const useProviderSettingsForm = (provider) => {
  const plugin = usePlugin('ai');
  const p = plugin.aiManager.llmProviders.get(provider);
  return p?.components?.ProviderSettingsForm;
};
// Render the ProviderSettings component for the current provider
export const Settings = observer(
  () => {
    const form = useForm();
    const record = useCollectionRecordData();
    const Component = useProviderSettingsForm(form.values.provider || record.provider);
    return Component ? React.createElement(Component, null) : null;
  },
  { displayName: 'LLMProviderSettings' },
);
export const LLMServices = () => {
  const t = useT();
  const [providers, setProviders] = useState([]);
  const api = useAPIClient();
  const location = useLocation();
  const [autoOpen, setAutoOpen] = useState(false);
  useEffect(() => {
    const state = location.state;
    if (state?.autoOpenAddNew) {
      setAutoOpen(true);
    }
  }, [location.state]);
  useRequest(
    () =>
      api
        .resource('ai')
        .listLLMProviders()
        .then((res) => {
          const providers = res?.data?.data || [];
          return providers.map((provider) => ({
            key: provider.name,
            label: Schema.compile(provider.title || provider.name, { t }),
            value: provider.name,
            supportedModel: provider.supportedModel,
          }));
        }),
    {
      onSuccess: (providers) => {
        setProviders(providers);
      },
    },
  );
  return React.createElement(
    AutoOpenContext.Provider,
    { value: { autoOpen, setAutoOpen } },
    React.createElement(
      LLMProvidersContext.Provider,
      { value: { providers } },
      React.createElement(
        ExtendCollectionsProvider,
        { collections: [llmServices] },
        React.createElement(SchemaComponent, {
          schema: llmsSchema,
          components: {
            AddNew,
            Settings,
            LLMTestFlight,
            EnabledModelsSelect,
            ProviderDisplay,
            ModelOptionsSettings,
            EnabledSwitch,
          },
          scope: {
            t,
            providers,
            useEditFormProps,
            useCancelActionProps,
            useCreateActionProps,
            useEditActionProps,
            useDestroyActionProps: useLLMDestroyActionProps,
            useBulkDestroyActionProps: useLLMBulkDestroyActionProps,
          },
        }),
      ),
    ),
  );
};
//# sourceMappingURL=LLMServices.js.map
