/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown, Spin, Typography, App } from 'antd';
import { PlusOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import { useAPIClient, useApp, useToken } from '@nocobase/client';
import { observer } from '@nocobase/flow-engine';
import { useChatBoxStore } from './stores/chat-box';
import { useT } from '../../locale';
import { AddLLMModal } from './AddLLMModal';
import { useLLMServiceCatalog } from '../../llm-services/hooks/useLLMServiceCatalog';
import { isSameModel, isValidModel, MODEL_PREFERENCE_STORAGE_KEY, resolveModel } from './model';
export const ModelSwitcher = observer(
  () => {
    const t = useT();
    const app = useApp();
    const api = useAPIClient();
    const { token } = useToken();
    const { message } = App.useApp();
    const [isOpen, setIsOpen] = useState(false);
    const currentEmployee = useChatBoxStore.use.currentEmployee();
    const currentEmployeeUsername = currentEmployee?.username;
    const model = useChatBoxStore.use.model();
    const setModel = useChatBoxStore.use.setModel();
    const hasConfigPermission = app.pluginSettingsManager.has('ai.llm-services');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const { repo, services: llmServices, loading, allModelsWithLabel, allModels } = useLLMServiceCatalog();
    const servicesWithModels = llmServices.filter(
      (service) => Array.isArray(service.enabledModels) && service.enabledModels.length > 0,
    );
    // Initialize: cache >> first model
    useEffect(() => {
      if (!currentEmployeeUsername || !allModels.length) return;
      const resolved = resolveModel(api, currentEmployeeUsername, allModels, model);
      if (isSameModel(resolved, model)) {
        return;
      }
      setModel(resolved);
    }, [api, currentEmployeeUsername, allModels, model, setModel]);
    // Current selected model value
    const selectedModel = useMemo(() => {
      if (isValidModel(model, allModels)) {
        return model;
      }
      if (allModels.length) {
        return { llmService: allModels[0].llmService, model: allModels[0].model };
      }
      return undefined;
    }, [model, allModels]);
    // Current display label
    const selectedLabel = useMemo(() => {
      if (selectedModel) {
        const found = allModelsWithLabel.find(
          (m) => m.llmService === selectedModel.llmService && m.model === selectedModel.model,
        );
        return found?.label || selectedModel.model;
      }
      return undefined;
    }, [selectedModel, allModelsWithLabel]);
    // Handle selection
    const handleSelect = (llmService, modelValue) => {
      const target = allModelsWithLabel.find((m) => m.llmService === llmService && m.value === modelValue);
      if (target) {
        const newValue = { llmService: target.llmService, model: target.model };
        setModel(newValue);
        if (currentEmployee) {
          try {
            api?.storage.setItem(
              MODEL_PREFERENCE_STORAGE_KEY + currentEmployee.username,
              `${target.llmService}:${target.model}`,
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
    };
    // Open add LLM modal or show warning
    const handleAddModel = () => {
      if (hasConfigPermission) {
        setAddModalOpen(true);
      } else {
        message.warning(t('Please contact the administrator to configure models'));
      }
    };
    if (!currentEmployee) return null;
    if (loading && !llmServices.length) return React.createElement(Spin, { size: 'small' });
    const hasModels = servicesWithModels.length > 0;
    // Build dropdown menu items
    const menuItems = [];
    servicesWithModels.forEach((service, sIndex) => {
      if (sIndex > 0) {
        menuItems.push({ type: 'divider', key: `divider-${sIndex}` });
      }
      // Group label
      menuItems.push({
        key: `group-${service.llmService}`,
        label: React.createElement(
          Typography.Text,
          { type: 'secondary', style: { fontSize: 12 } },
          service.llmServiceTitle,
        ),
        disabled: true,
        style: { cursor: 'default', padding: '4px 12px', height: 'auto', minHeight: 0 },
      });
      // Model items
      service.enabledModels.forEach((model) => {
        const isSelected =
          selectedModel && selectedModel.llmService === service.llmService && selectedModel.model === model.value;
        menuItems.push({
          key: `${service.llmService}:${model.value}`,
          label: React.createElement(
            'span',
            { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
            React.createElement('span', null, model.label),
            isSelected && React.createElement(CheckOutlined, { style: { fontSize: 12, color: token.colorPrimary } }),
          ),
          onClick: () => handleSelect(service.llmService, model.value),
        });
      });
    });
    // Empty placeholder when no services
    if (!hasModels) {
      menuItems.push({
        key: 'empty-placeholder',
        label: React.createElement(
          Typography.Text,
          { type: 'secondary', style: { fontSize: 12 } },
          t('No LLM services enabled yet'),
        ),
        disabled: true,
        style: { cursor: 'default', padding: '16px 12px', height: 'auto', minHeight: 0 },
      });
    }
    // Add divider and "Add LLM Service" button at the bottom
    if (menuItems.length > 0) {
      menuItems.push({ type: 'divider', key: 'divider-add' });
    }
    menuItems.push({
      key: 'add-model',
      icon: React.createElement(PlusOutlined, null),
      label: t('Add LLM service'),
      onClick: handleAddModel,
    });
    const dropdownContent = React.createElement(
      'span',
      {
        onClick: (e) => {
          // Allow dropdown to handle click
          e.stopPropagation();
        },
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          backgroundColor: token.colorFillTertiary,
          borderRadius: 6,
          height: 28,
          padding: '0 8px',
          cursor: 'pointer',
          minWidth: hasModels ? 'auto' : undefined,
          userSelect: 'none',
        },
      },
      React.createElement(
        'span',
        {
          style: {
            color: hasModels ? token.colorText : token.colorError,
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 88,
          },
        },
        hasModels ? selectedLabel : t('No model available'),
      ),
      React.createElement(DownOutlined, {
        style: { fontSize: 10, color: hasModels ? token.colorTextSecondary : token.colorError },
      }),
    );
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Dropdown,
        {
          menu: { items: menuItems, style: { maxHeight: 400, overflow: 'auto' } },
          trigger: ['hover'],
          open: isOpen,
          onOpenChange: setIsOpen,
          overlayStyle: { zIndex: 1200 },
        },
        dropdownContent,
      ),
      hasConfigPermission &&
        React.createElement(AddLLMModal, {
          open: addModalOpen,
          onClose: () => setAddModalOpen(false),
          onSuccess: () => repo.refreshLLMServices(),
        }),
    );
  },
  { displayName: 'ModelSwitcher' },
);
//# sourceMappingURL=ModelSwitcher.js.map
