/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Spin, Popover, Card, Tag, Select, Switch, Alert } from 'antd';
import { FlowModel, tExpr, useFlowSettingsContext, observer } from '@nocobase/flow-engine';
import { avatars } from '../../avatars';
import { useChatBoxActions } from '../../chatbox/hooks/useChatBoxActions';
import { ProfileCard } from '../../ProfileCard';
import { RemoteSelect, TextAreaWithContextSelector, useRequest, useToken } from '@nocobase/client';
import { AddContextButton } from '../../AddContextButton';
import { Schema, useField } from '@formily/react';
import { ContextItem } from '../../chatbox/ContextItem';
import { dialogController } from '../../stores/dialog-controller';
import { namespace } from '../../../locale';
import { useChatMessagesStore } from '../../chatbox/stores/chat-messages';
import { useChatConversationsStore } from '../../chatbox/stores/chat-conversations';
import { useLLMServiceCatalog } from '../../../llm-services/hooks/useLLMServiceCatalog';
import { useLLMProviders } from '../../../llm-services/llm-providers';
import { useT } from '../../../locale';
import { buildProviderGroupedModelOptions, getServiceByOverride } from '../../../llm-services/utils';
import { useAIConfigRepository } from '../../../repositories/hooks/useAIConfigRepository';
const { Meta } = Card;
const Shortcut = ({ aiEmployee: { username }, tasks, showNotice, builtIn, style = {}, context, auto }) => {
  const { size, mask } = style;
  const [focus, setFocus] = useState(false);
  const aiConfigRepository = useAIConfigRepository();
  const { loading } = useRequest(async () => {
    return aiConfigRepository.getAIEmployees();
  });
  const aiEmployeesMap = aiConfigRepository.getAIEmployeesMap();
  const aiEmployee = aiEmployeesMap[username];
  const { triggerTask } = useChatBoxActions();
  const addContextItems = useChatMessagesStore.use.addContextItems();
  const setWebSearch = useChatConversationsStore.use.setWebSearch();
  const currentAvatar = useMemo(() => {
    const avatar = aiEmployee?.avatar;
    if (!avatar) {
      return null;
    }
    if (focus || showNotice) {
      return avatars(avatar, {
        mask: undefined,
        flip: true,
      });
    }
    return avatars(avatar, {
      mouth: undefined,
      mask: mask !== false ? ['dark'] : undefined,
    });
  }, [aiEmployee, focus, showNotice, mask]);
  if (!aiEmployee) {
    return null;
  }
  return React.createElement(
    Spin,
    { spinning: loading },
    React.createElement(
      Popover,
      { content: React.createElement(ProfileCard, { aiEmployee: aiEmployee, tasks: tasks }) },
      React.createElement(Avatar, {
        src: currentAvatar,
        size: size || 52,
        shape: 'circle',
        style: {
          cursor: 'pointer',
        },
        // @ts-ignore
        onMouseEnter: () => {
          setFocus(true);
        },
        onMouseLeave: () => setFocus(false),
        onClick: () => {
          triggerTask({ aiEmployee, tasks, auto });
          if (context?.workContext?.length) {
            addContextItems(context.workContext);
          }
        },
      }),
    ),
  );
};
export class AIEmployeeShortcutModel extends FlowModel {
  render() {
    return React.createElement(Shortcut, { ...this.props });
  }
}
const Information = ({ aiEmployeesMap = {} }) => {
  const { token } = useToken();
  const ctx = useFlowSettingsContext();
  const username = ctx.model.props.aiEmployee?.username;
  const aiEmployee = aiEmployeesMap[username];
  if (!aiEmployee) {
    return null;
  }
  return React.createElement(
    Card,
    {
      variant: 'borderless',
      style: {
        maxWidth: 520,
      },
    },
    React.createElement(Meta, {
      avatar: aiEmployee.avatar ? React.createElement(Avatar, { src: avatars(aiEmployee.avatar), size: 48 }) : null,
      title: React.createElement(
        React.Fragment,
        null,
        aiEmployee.nickname,
        aiEmployee.position &&
          React.createElement(
            Tag,
            {
              style: {
                marginLeft: token.margin,
              },
            },
            aiEmployee.position,
          ),
      ),
      description: React.createElement(React.Fragment, null, aiEmployee.bio),
    }),
  );
};
const WorkContext = () => {
  const field = useField();
  const onAdd = (contextItem) => {
    const exists = field.value.some((item) => item.type === contextItem.type && item.uid === contextItem.uid);
    if (!exists) {
      field.value = [...field.value, contextItem];
    }
  };
  const onRemove = (type, uid) => {
    field.value = field.value.filter((item) => !(item.type === type && item.uid === uid));
  };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      null,
      field.value.map((item) =>
        React.createElement(ContextItem, {
          within: 'task',
          key: `${item.type}:${item.uid}`,
          item: item,
          closable: true,
          onRemove: onRemove,
        }),
      ),
    ),
    React.createElement(AddContextButton, { contextItems: field.value, onAdd: onAdd, onRemove: onRemove }),
  );
};
const SkillSettings = ({ aiEmployeesMap = {} }) => {
  const t = useT();
  const field = useField();
  const ctx = useFlowSettingsContext();
  const username = ctx.model.props.aiEmployee?.username;
  const aiEmployee = aiEmployeesMap[username];
  const defaultSkills = aiEmployee?.skillSettings?.skills?.map(({ name }) => name) ?? [];
  if (field.value?.skills?.length) {
    field.addProperty(
      'skills',
      field.value.skills.filter((skill) => defaultSkills.includes(skill)),
    );
  }
  const handleChange = (value) => {
    field.addProperty('skills', value);
  };
  return React.createElement(RemoteSelect, {
    defaultValue: field.value?.skills,
    onChange: handleChange,
    manual: false,
    multiple: true,
    placeholder: t('Use all AI employee skills'),
    fieldNames: {
      label: 'title',
      value: 'name',
    },
    service: {
      resource: 'aiTools',
      action: 'listBinding',
      params: {
        username,
      },
    },
  });
};
const TaskModelSelect = observer(() => {
  const t = useT();
  const field = useField();
  const { services, loading } = useLLMServiceCatalog();
  const providers = useLLMProviders();
  const options = useMemo(
    () => buildProviderGroupedModelOptions(services, providers, (label) => Schema.compile(label, { t })),
    [services, providers, t],
  );
  const selectedValue =
    field.value?.llmService && field.value?.model ? `${field.value.llmService}:${field.value.model}` : undefined;
  const handleChange = (value) => {
    if (!value) {
      field.value = null;
      return;
    }
    const [llmService, model] = value.split(':');
    field.value = { llmService, model };
  };
  return React.createElement(Select, {
    allowClear: true,
    showSearch: true,
    value: selectedValue,
    placeholder: t('Use default model'),
    options: options,
    onChange: handleChange,
    loading: loading,
    notFoundContent: loading ? React.createElement(Spin, { size: 'small' }) : null,
    optionFilterProp: 'label',
  });
});
const TaskWebSearchSwitch = observer(() => {
  const t = useT();
  const field = useField();
  const modelField = field.query('.model').take();
  const { services } = useLLMServiceCatalog();
  const selectedService = useMemo(() => getServiceByOverride(services, modelField?.value), [
    modelField?.value,
    services,
  ]);
  const supportWebSearch = selectedService?.supportWebSearch;
  const isDisabled = !!modelField?.value && supportWebSearch === false;
  const showConflictWarning = !!field.value && !!selectedService?.isToolConflict;
  useEffect(() => {
    if (isDisabled && field.value) {
      field.value = false;
    }
  }, [isDisabled, field]);
  return React.createElement(
    'div',
    null,
    React.createElement(Switch, {
      checked: !!field.value,
      disabled: isDisabled,
      onChange: (checked) => (field.value = checked),
    }),
    isDisabled &&
      React.createElement(
        'div',
        { style: { marginTop: 8, color: 'rgba(0, 0, 0, 0.45)' } },
        t('Web search not supported'),
      ),
    showConflictWarning &&
      React.createElement(Alert, {
        style: { marginTop: 8 },
        type: 'warning',
        showIcon: true,
        message: t('Search disables tools'),
      }),
  );
});
AIEmployeeShortcutModel.registerFlow({
  key: 'shortcutSettings',
  title: tExpr('Task settings', { ns: namespace }),
  steps: {
    editTasks: {
      title: tExpr('Edit tasks', { ns: namespace }),
      uiMode(ctx) {
        return {
          type: 'dialog',
          props: {
            styles: {
              mask: { zIndex: dialogController.shouldHide ? -1 : 9999 },
              wrapper: { zIndex: dialogController.shouldHide ? -1 : 9999 },
            },
          },
        };
      },
      uiSchema: async (ctx) => {
        await ctx.aiConfigRepository.getAIEmployees();
        const aiEmployeesMap = ctx.aiConfigRepository.getAIEmployeesMap();
        return {
          profile: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': () => React.createElement(Information, { aiEmployeesMap: aiEmployeesMap }),
          },
          tasks: {
            type: 'array',
            title: tExpr('Task', { ns: namespace }),
            'x-component': 'ArrayTabs',
            'x-component-props': {
              size: 'small',
            },
            items: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  title: tExpr('Title', { ns: namespace }),
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    tooltip: tExpr('Label for task selection buttons when multiple tasks exist', { ns: namespace }),
                  },
                },
                message: {
                  type: 'object',
                  properties: {
                    system: {
                      title: tExpr('Background', { ns: namespace }),
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        tooltip: tExpr(
                          'Additional system prompt appended to the AI employee’s definition, used to refine instructions',
                          { ns: namespace },
                        ),
                      },
                      'x-component': TextAreaWithContextSelector,
                    },
                    user: {
                      title: tExpr('Default user message', { ns: namespace }),
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': TextAreaWithContextSelector,
                    },
                    workContext: {
                      title: tExpr('Work context', { ns: namespace }),
                      type: 'array',
                      'x-decorator': 'FormItem',
                      'x-component': WorkContext,
                    },
                  },
                },
                autoSend: {
                  type: 'boolean',
                  'x-content': tExpr('Send default user message automatically', { ns: namespace }),
                  'x-decorator': 'FormItem',
                  'x-component': 'Checkbox',
                },
                skillSettings: {
                  title: tExpr('Skills', { ns: namespace }),
                  type: 'object',
                  nullable: true,
                  'x-decorator': 'FormItem',
                  'x-component': () => React.createElement(SkillSettings, { aiEmployeesMap: aiEmployeesMap }),
                  'x-decorator-props': {
                    tooltip: tExpr('Restrict task skills', {
                      ns: namespace,
                    }),
                  },
                },
                model: {
                  title: tExpr('Model', { ns: namespace }),
                  type: 'object',
                  nullable: true,
                  'x-decorator': 'FormItem',
                  'x-component': TaskModelSelect,
                },
                webSearch: {
                  title: tExpr('Web search', { ns: namespace }),
                  type: 'boolean',
                  default: false,
                  'x-decorator': 'FormItem',
                  'x-component': TaskWebSearchSwitch,
                },
              },
            },
          },
        };
      },
      handler(ctx, params) {
        ctx.model.setProps({
          tasks: params.tasks,
        });
      },
    },
  },
});
//# sourceMappingURL=AIEmployeeShortcutModel.js.map
