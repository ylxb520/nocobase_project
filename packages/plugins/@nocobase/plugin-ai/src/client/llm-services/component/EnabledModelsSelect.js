/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useAPIClient, usePlugin } from '@nocobase/client';
import { useForm, useField, observer } from '@formily/react';
import { Select, Spin, Radio, Space, Tag, Typography, Input, Button, App } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useT } from '../../locale';
import { isRecommendedModel, getRecommendedModels } from '../../../common/recommended-models';
const { Text } = Typography;
/**
 * Strip known prefixes from a model ID.
 */
export const stripModelIdPrefix = (id) => {
  let name = id;
  name = name.replace(/^ft:/, '');
  const slashIndex = name.lastIndexOf('/');
  if (slashIndex !== -1) {
    name = name.substring(slashIndex + 1);
  }
  return name;
};
export const capitalize = (s) => (s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s);
/**
 * Merge consecutive short (≤2 digit) numeric segments with '.'.
 * e.g. ["claude","opus","4","5","20251101"] → ["claude","opus","4.5","20251101"]
 */
export const mergeVersionSegments = (segments) => {
  const result = [];
  let i = 0;
  while (i < segments.length) {
    if (/^\d{1,2}$/.test(segments[i])) {
      let version = segments[i];
      while (i + 1 < segments.length && /^\d{1,2}$/.test(segments[i + 1])) {
        version += '.' + segments[i + 1];
        i++;
      }
      result.push(version);
    } else {
      result.push(segments[i]);
    }
    i++;
  }
  return result;
};
/**
 * Default fallback: space-separated, version-merged.
 */
export const formatModelLabel = (id) => {
  const name = stripModelIdPrefix(id);
  const segments = mergeVersionSegments(name.split(/[-_]/));
  return segments.map(capitalize).join(' ');
};
/**
 * Normalize old `string[]` format to new `EnabledModelsConfig`.
 * Also handles null/undefined gracefully.
 */
export const normalizeEnabledModels = (value) => {
  if (!value) {
    return { mode: 'recommended', models: [] };
  }
  // Already new format
  if (typeof value === 'object' && !Array.isArray(value) && value.mode) {
    return value;
  }
  // Old string[] format
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { mode: 'recommended', models: [] };
    }
    return {
      mode: 'custom',
      models: value.map((id) => ({ label: id, value: id })),
    };
  }
  return { mode: 'recommended', models: [] };
};
export const EnabledModelsSelect = observer((props) => {
  const api = useAPIClient();
  const t = useT();
  const plugin = usePlugin('ai');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const field = useField();
  const form = useForm();
  const { message } = App.useApp();
  const provider = form.values.provider;
  const formOptions = form.values.options;
  // Use provider-specific formatModelLabel if available, otherwise default
  const providerOptions = provider ? plugin.aiManager.llmProviders.get(provider) : null;
  const labelFormatter = providerOptions?.formatModelLabel || formatModelLabel;
  const hasRecommended = !!provider && getRecommendedModels(provider).length > 0;
  // Access deep properties to establish observer tracking
  const optionsKey = JSON.stringify(formOptions);
  // Derive current config from field value
  const config = normalizeEnabledModels(field.value);
  // Cache models per mode so switching doesn't lose edits
  const modelsCache = useRef({
    recommended: [],
    provider: [],
    custom: [],
  });
  // Initialize field value on mount if it's an old format
  useEffect(() => {
    const normalized = normalizeEnabledModels(field.value);
    if (field.value !== normalized && (Array.isArray(field.value) || !field.value)) {
      field.value = normalized;
    }
    // Seed cache with initial models
    modelsCache.current[normalized.mode] = normalized.models;
  }, []);
  // If there are no recommended models, default to provider mode.
  useEffect(() => {
    if (!provider) {
      return;
    }
    if (!hasRecommended && config.mode === 'recommended') {
      modelsCache.current.recommended = config.models;
      updateFieldValue({ mode: 'provider', models: modelsCache.current.provider || [] });
    }
  }, [provider, hasRecommended, config.mode]);
  // Reset options when provider or options change so stale data is cleared
  const prevKeyRef = useRef('');
  useEffect(() => {
    const currentKey = `${provider}:${optionsKey}`;
    if (prevKeyRef.current && prevKeyRef.current !== currentKey) {
      setOptions([]);
    }
    prevKeyRef.current = currentKey;
  }, [provider, optionsKey]);
  // Fetch models on demand when the Select dropdown is opened
  const fetchModels = async () => {
    if (!provider) {
      setOptions([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api
        .resource('ai')
        .listProviderModels({ values: { provider, options: formOptions } }, { skipNotify: true });
      const items =
        res?.data?.data?.map(({ id }) => ({
          label: labelFormatter(id),
          value: id,
        })) || [];
      // Sort: recommended models first
      const sortedItems = items.sort((a, b) => {
        const aRecommended = isRecommendedModel(provider, a.value);
        const bRecommended = isRecommendedModel(provider, b.value);
        if (aRecommended && !bRecommended) return -1;
        if (!aRecommended && bRecommended) return 1;
        return 0;
      });
      setOptions(sortedItems);
    } catch (error) {
      setOptions([]);
      message.error(error?.response?.data?.errors?.[0]?.message || error?.message || 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };
  const handleDropdownVisibleChange = (open) => {
    if (open) {
      fetchModels();
    }
  };
  const updateFieldValue = (newConfig) => {
    field.value = { ...newConfig };
  };
  const handleModeChange = (newMode) => {
    // Save current mode's models to cache
    modelsCache.current[config.mode] = config.models;
    // Restore target mode's models from cache
    updateFieldValue({ mode: newMode, models: modelsCache.current[newMode] || [] });
  };
  const handleProviderModelsChange = (selectedValues) => {
    const models = selectedValues.map((val) => {
      // Find label from options
      const opt = options.find((o) => o.value === val);
      return { label: opt ? opt.label : labelFormatter(val), value: val };
    });
    updateFieldValue({ mode: 'provider', models });
  };
  const handleCustomModelChange = (index, key, val) => {
    const newModels = [...config.models];
    newModels[index] = { ...newModels[index], [key]: val };
    updateFieldValue({ mode: 'custom', models: newModels });
  };
  const handleAddCustomModel = () => {
    updateFieldValue({ mode: 'custom', models: [...config.models, { label: '', value: '' }] });
  };
  const handleRemoveCustomModel = (index) => {
    const newModels = config.models.filter((_, i) => i !== index);
    updateFieldValue({ mode: 'custom', models: newModels });
  };
  return React.createElement(
    'div',
    { style: { width: '100%' } },
    React.createElement(
      Radio.Group,
      { value: config.mode, onChange: (e) => handleModeChange(e.target.value), style: { width: '100%' } },
      React.createElement(
        Space,
        { direction: 'vertical', style: { width: '100%' } },
        hasRecommended &&
          React.createElement(
            React.Fragment,
            null,
            React.createElement(Radio, { value: 'recommended' }, t('Recommended models')),
            config.mode === 'recommended' &&
              React.createElement(
                Text,
                { type: 'secondary', style: { paddingLeft: 24 } },
                t('Use recommended models:') +
                  ' ' +
                  getRecommendedModels(provider)
                    .map((m) => m.label)
                    .join(', '),
              ),
          ),
        React.createElement(Radio, { value: 'provider' }, t('Select models')),
        config.mode === 'provider' &&
          React.createElement(
            'div',
            { style: { paddingLeft: 24 } },
            React.createElement(Select, {
              mode: 'multiple',
              options: options,
              loading: loading,
              notFoundContent: loading ? React.createElement(Spin, { size: 'small' }) : undefined,
              value: config.models.map((m) => m.value),
              onChange: handleProviderModelsChange,
              onDropdownVisibleChange: handleDropdownVisibleChange,
              placeholder: t('Select models to enable'),
              style: { width: '100%' },
              optionRender: (option) => {
                const recommended = isRecommendedModel(provider, option.value);
                return React.createElement(
                  Space,
                  null,
                  React.createElement('span', null, option.label),
                  recommended &&
                    React.createElement(Tag, { color: 'blue', style: { marginLeft: 4 } }, t('Recommended')),
                );
              },
            }),
          ),
        React.createElement(Radio, { value: 'custom' }, t('Manual input')),
        config.mode === 'custom' &&
          React.createElement(
            'div',
            { style: { paddingLeft: 24 } },
            config.models.map((model, index) =>
              React.createElement(
                Space,
                { key: index, style: { display: 'flex', marginBottom: 8 }, align: 'baseline' },
                React.createElement(Input, {
                  placeholder: t('Model id'),
                  value: model.value,
                  onChange: (e) => handleCustomModelChange(index, 'value', e.target.value),
                  style: { width: 200 },
                }),
                React.createElement(Input, {
                  placeholder: t('Display name'),
                  value: model.label,
                  onChange: (e) => handleCustomModelChange(index, 'label', e.target.value),
                  style: { width: 200 },
                }),
                React.createElement(Button, {
                  type: 'text',
                  icon: React.createElement(DeleteOutlined, null),
                  onClick: () => handleRemoveCustomModel(index),
                }),
              ),
            ),
            React.createElement(
              Button,
              {
                type: 'dashed',
                onClick: handleAddCustomModel,
                icon: React.createElement(PlusOutlined, null),
                style: { width: '100%' },
              },
              t('Add model'),
            ),
          ),
      ),
    ),
  );
});
//# sourceMappingURL=EnabledModelsSelect.js.map
