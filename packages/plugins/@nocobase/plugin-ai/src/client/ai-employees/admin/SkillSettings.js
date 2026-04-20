/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef, useState } from 'react';
import { List, Button, Dropdown, Space, Segmented, Flex, Collapse, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useT } from '../../locale';
import { SchemaComponent, useCollectionRecordData, useToken } from '@nocobase/client';
import { Schema, useField } from '@formily/react';
import { useAIConfigRepository } from '../../repositories/hooks/useAIConfigRepository';
import { observer } from '@nocobase/flow-engine';
export const SkillsListItem = ({ name, title, description, isRoot }) => {
  const t = useT();
  const { token } = useToken();
  const field = useField();
  const checked = field.value?.find((item) => item.name === name);
  return React.createElement(
    'div',
    {
      style: {
        minWidth: '150px',
        maxWidth: '300px',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
        },
      },
      React.createElement('div', null, Schema.compile(title, { t })),
      !isRoot &&
        React.createElement(
          'div',
          null,
          React.createElement(Switch, { size: 'small', value: checked, disabled: checked }),
        ),
    ),
    React.createElement(
      'div',
      { style: { color: token.colorTextSecondary, fontSize: token.fontSizeSM } },
      Schema.compile(description, { t }),
    ),
  );
};
export const Skills = observer(() => {
  const t = useT();
  const { token } = useToken();
  const field = useField();
  const aiConfigRepository = useAIConfigRepository();
  const loading = aiConfigRepository.aiToolsLoading;
  const tools = aiConfigRepository.aiTools;
  const record = useCollectionRecordData();
  const isBuiltIn = record?.builtIn;
  useEffect(() => {
    aiConfigRepository.getAITools();
  }, [aiConfigRepository]);
  const handleAdd = (name) => {
    const skills = [...(field.value || [])];
    if (!skills.some((s) => s.name === name)) {
      skills.push({ name, autoCall: false });
    }
    field.value = skills;
  };
  const selectedSkills = [...(field.value ?? [])];
  const selectedNames = new Set(selectedSkills.map((item) => item.name));
  const customAddItems =
    tools
      ?.filter((item) => item.scope === 'CUSTOM' && !selectedNames.has(item.definition.name))
      .map((item) => {
        const result = {
          key: item.definition.name,
        };
        const itemProps = {
          title: item.introduction.title ?? '',
          description: item.introduction.about ?? '',
          name: item.definition.name,
          isRoot: true,
        };
        result.label = React.createElement(SkillsListItem, { ...itemProps });
        result.onClick = () => handleAdd(item.definition.name);
        return result;
      }) || [];
  const toolsByName = new Map(tools.map((tool) => [tool.definition.name, tool]));
  const generalTools = tools.filter((tool) => tool.scope === 'GENERAL');
  const specifiedSkills = selectedSkills.filter((item) => {
    const tool = toolsByName.get(item.name);
    return tool && tool.scope !== 'GENERAL' && tool.scope !== 'CUSTOM';
  });
  const customSkills = selectedSkills.filter((item) => {
    const tool = toolsByName.get(item.name);
    return tool && tool.scope === 'CUSTOM';
  });
  const permissionOptions = [
    { label: t('Ask'), value: 'ASK' },
    { label: t('Allow'), value: 'ALLOW' },
  ];
  const getPermissionValue = (tool, item) => {
    if (tool.scope === 'CUSTOM') {
      return item?.autoCall ? 'ALLOW' : 'ASK';
    }
    return tool.defaultPermission === 'ALLOW' ? 'ALLOW' : 'ASK';
  };
  const [customActiveKeys, setCustomActiveKeys] = useState(
    isBuiltIn && customSkills.length === 0 ? [] : ['custom-skills'],
  );
  const previousCustomLength = useRef(customSkills.length);
  useEffect(() => {
    const wasEmpty = previousCustomLength.current === 0;
    if (isBuiltIn && customSkills.length === 0) {
      setCustomActiveKeys([]);
    } else if (wasEmpty && customSkills.length > 0) {
      setCustomActiveKeys(['custom-skills']);
    }
    previousCustomLength.current = customSkills.length;
  }, [customSkills.length, isBuiltIn]);
  return React.createElement(
    React.Fragment,
    null,
    !loading &&
      React.createElement(
        Space,
        { direction: 'vertical', size: 'large', style: { width: '100%' } },
        React.createElement(
          'div',
          null,
          React.createElement(Collapse, {
            ghost: true,
            size: 'small',
            defaultActiveKey: [],
            items: [
              {
                key: 'general-skills',
                label: React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'div',
                    { style: { fontWeight: token.fontWeightStrong, fontSize: token.fontSizeSM } },
                    t('General skills'),
                  ),
                  React.createElement(
                    'div',
                    { style: { color: token.colorTextSecondary, fontSize: token.fontSizeSM } },
                    t('Shared by all AI employees. Read-only.'),
                  ),
                ),
                children: React.createElement(List, {
                  itemLayout: 'vertical',
                  size: 'small',
                  dataSource: generalTools,
                  renderItem: (tool) => {
                    return React.createElement(
                      List.Item,
                      {
                        key: tool.definition.name,
                        extra: React.createElement(
                          Flex,
                          { vertical: true, justify: 'end' },
                          React.createElement(
                            'div',
                            { style: { fontSize: token.fontSizeSM, color: token.colorTextSecondary } },
                            t('Permission'),
                            React.createElement(Segmented, {
                              style: { marginLeft: '8px' },
                              size: 'small',
                              options: permissionOptions,
                              value: getPermissionValue(tool),
                              disabled: true,
                            }),
                          ),
                        ),
                      },
                      React.createElement(
                        'div',
                        { style: { fontSize: token.fontSizeSM } },
                        Schema.compile(tool.introduction.title, { t }),
                      ),
                      React.createElement(
                        'div',
                        { style: { color: token.colorTextSecondary, fontSize: token.fontSizeSM } },
                        Schema.compile(tool.introduction.about, { t }),
                      ),
                    );
                  },
                }),
              },
            ],
          }),
        ),
        isBuiltIn &&
          specifiedSkills.length > 0 &&
          React.createElement(
            'div',
            null,
            React.createElement(Collapse, {
              ghost: true,
              size: 'small',
              items: [
                {
                  key: 'specific-skills',
                  label: React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { style: { fontWeight: token.fontWeightStrong, fontSize: token.fontSizeSM } },
                      t('Employee-specific skills'),
                    ),
                    React.createElement(
                      'div',
                      { style: { color: token.colorTextSecondary, fontSize: token.fontSizeSM } },
                      t('Only available to this AI employee. Read-only.'),
                    ),
                  ),
                  children: React.createElement(List, {
                    itemLayout: 'vertical',
                    size: 'small',
                    dataSource: specifiedSkills,
                    renderItem: (item) => {
                      const tool = toolsByName.get(item.name);
                      if (!tool) {
                        return null;
                      }
                      return React.createElement(
                        List.Item,
                        {
                          key: tool.definition.name,
                          extra: React.createElement(
                            Flex,
                            { vertical: true, justify: 'end' },
                            React.createElement(
                              'div',
                              { style: { fontSize: token.fontSizeSM, color: token.colorTextSecondary } },
                              t('Permission'),
                              React.createElement(Segmented, {
                                style: { marginLeft: '8px' },
                                size: 'small',
                                options: permissionOptions,
                                value: getPermissionValue(tool, item),
                                disabled: true,
                              }),
                            ),
                          ),
                        },
                        React.createElement(
                          'div',
                          { style: { fontSize: token.fontSizeSM } },
                          Schema.compile(tool.introduction.title, { t }),
                        ),
                        React.createElement(
                          'div',
                          { style: { color: token.colorTextSecondary, fontSize: token.fontSizeSM } },
                          Schema.compile(tool.introduction.about, { t }),
                        ),
                      );
                    },
                  }),
                },
              ],
              defaultActiveKey: ['specific-skills'],
            }),
          ),
        React.createElement(
          'div',
          null,
          React.createElement(Collapse, {
            ghost: true,
            size: 'small',
            activeKey: customActiveKeys,
            onChange: (keys) => {
              const nextKeys = Array.isArray(keys) ? keys : [keys].filter(Boolean);
              setCustomActiveKeys(nextKeys);
            },
            items: [
              {
                key: 'custom-skills',
                label: React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'div',
                    { style: { fontWeight: token.fontWeightStrong, fontSize: token.fontSizeSM } },
                    t('Custom skills'),
                  ),
                  React.createElement(
                    'div',
                    { style: { color: token.colorTextSecondary, fontSize: token.fontSizeSM } },
                    t('Created via workflow. You can add/remove and set default permissions.'),
                  ),
                ),
                extra: React.createElement(
                  'div',
                  {
                    onClick: (event) => {
                      event.stopPropagation();
                    },
                    onKeyDown: (event) => {
                      event.stopPropagation();
                    },
                  },
                  React.createElement(
                    Dropdown,
                    {
                      menu: {
                        items: customAddItems,
                      },
                      placement: 'bottomRight',
                      disabled: customAddItems.length === 0,
                    },
                    React.createElement(
                      Button,
                      { type: 'primary', icon: React.createElement(PlusOutlined, null) },
                      t('Add skill'),
                    ),
                  ),
                ),
                children: React.createElement(List, {
                  itemLayout: 'vertical',
                  bordered: true,
                  dataSource: customSkills,
                  renderItem: (item) => {
                    const tool = toolsByName.get(item.name);
                    if (!tool) {
                      return null;
                    }
                    return React.createElement(
                      List.Item,
                      {
                        key: tool.definition.name,
                        extra: React.createElement(
                          Flex,
                          { vertical: true, justify: 'end' },
                          React.createElement(
                            Space,
                            null,
                            React.createElement(
                              'div',
                              { style: { fontSize: token.fontSizeSM } },
                              t('Permission'),
                              React.createElement(Segmented, {
                                style: { marginLeft: '8px', marginRight: '8px' },
                                size: 'small',
                                options: permissionOptions,
                                value: getPermissionValue(tool, item),
                                onChange: (value) => {
                                  const updated = (field.value || []).map((s) =>
                                    s.name === item.name ? { ...s, autoCall: value === 'ALLOW' } : s,
                                  );
                                  field.value = updated;
                                },
                              }),
                            ),
                            React.createElement(Button, {
                              icon: React.createElement(DeleteOutlined, null),
                              variant: 'link',
                              color: 'default',
                              onClick: () => {
                                const skills = [...(field.value || [])];
                                const index = skills.findIndex((s) => s.name === tool.definition.name);
                                if (index !== -1) {
                                  skills.splice(index, 1);
                                  field.value = skills;
                                }
                              },
                            }),
                          ),
                        ),
                      },
                      React.createElement('div', null, Schema.compile(tool.introduction.title, { t })),
                      React.createElement(
                        'div',
                        { style: { color: token.colorTextSecondary, fontSize: token.fontSizeSM } },
                        Schema.compile(tool.introduction.about, { t }),
                      ),
                    );
                  },
                }),
              },
            ],
          }),
        ),
      ),
  );
});
export const SkillSettings = () => {
  const t = useT();
  return React.createElement(SchemaComponent, {
    components: { Skills },
    schema: {
      type: 'void',
      properties: {
        skillSettings: {
          type: 'object',
          properties: {
            skills: {
              type: 'array',
              'x-component': 'Skills',
              'x-decorator': 'FormItem',
            },
          },
        },
      },
    },
  });
};
//# sourceMappingURL=SkillSettings.js.map
