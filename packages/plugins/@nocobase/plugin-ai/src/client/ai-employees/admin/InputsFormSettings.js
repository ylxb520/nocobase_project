/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState } from 'react';
import { Card, Button, Empty, Modal, Collapse, Form, Input, Switch, Select, List, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useT } from '../../locale';
import { useField } from '@formily/react';
import { FormItem, FormLayout } from '@formily/antd-v5';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const inputSourceLabels = {
  manual: 'Manual input',
  blocks: 'Blocks',
  fields: 'Field values',
  collections: 'Data sources & collections',
};
const InputsEditModal = ({ open, title, onOk, onCancel }) => {
  const t = useT();
  const [inputField, setInputField] = useState({
    title: '',
    sources: {
      manual: {
        enabled: true,
        value: '',
      },
      blocks: {
        enabled: false,
        value: [],
      },
      fields: {
        enabled: false,
        value: [],
      },
      collections: {
        enabled: false,
        value: [],
      },
    },
  });
  const handleTitleChange = (value) => {
    setInputField((prev) => ({
      ...prev,
      title: value,
    }));
  };
  const handleSwitchChange = (key, value) => {
    setInputField((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [key]: {
          ...prev.sources[key],
          enabled: value,
        },
      },
    }));
  };
  const handleValueChange = (key, value) => {
    setInputField((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [key]: {
          ...prev.sources[key],
          value,
        },
      },
    }));
  };
  return React.createElement(
    Modal,
    { open: open, title: title, onOk: () => onOk(inputField), onCancel: onCancel },
    React.createElement(
      FormLayout,
      { layout: 'vertical' },
      React.createElement(
        FormItem,
        { label: t('Title') },
        React.createElement(Input, { value: inputField.title, onChange: (e) => handleTitleChange(e.target.value) }),
      ),
      React.createElement(
        FormItem,
        { label: t('Input sources') },
        React.createElement(Collapse, {
          size: 'small',
          items: [
            {
              key: 'manual',
              label: t('Manual input'),
              children: React.createElement(
                Form.Item,
                null,
                React.createElement(Input, {
                  placeholder: t('Placeholder'),
                  onChange: (v) => handleValueChange('manual', v),
                }),
              ),
              extra: React.createElement(Switch, {
                size: 'small',
                defaultChecked: true,
                onChange: (v) => handleSwitchChange('manual', v),
              }),
            },
            {
              key: 'blocks',
              label: t('Blocks'),
              children: React.createElement(
                Form.Item,
                null,
                React.createElement(Select, {
                  allowClear: true,
                  mode: 'multiple',
                  options: [
                    {
                      key: 'table',
                      value: 'table',
                      label: t('Table'),
                    },
                    {
                      key: 'form',
                      value: 'form',
                      label: t('Form'),
                    },
                  ],
                  onChange: (v) => handleValueChange('blocks', v),
                }),
              ),
              extra: React.createElement(Switch, { size: 'small', onChange: (v) => handleSwitchChange('blocks', v) }),
            },
            {
              key: 'fields',
              label: t('Field values'),
              children: React.createElement(
                Form.Item,
                null,
                React.createElement(Select, {
                  mode: 'multiple',
                  allowClear: true,
                  options: [
                    {
                      key: 'input',
                      value: 'input',
                      label: t('Single line text'),
                    },
                  ],
                  onChange: (v) => handleValueChange('fields', v),
                }),
              ),
              extra: React.createElement(Switch, { size: 'small', onChange: (v) => handleSwitchChange('fields', v) }),
            },
            {
              key: 'collections',
              label: t('Data sources & collections'),
              children: React.createElement(
                Form.Item,
                null,
                React.createElement(Select, { onChange: (v) => handleValueChange('collections', v) }),
              ),
              extra: React.createElement(Switch, {
                size: 'small',
                onChange: (v) => handleSwitchChange('collections', v),
              }),
            },
          ],
        }),
      ),
    ),
  );
};
export const InputsFormSettings = () => {
  const t = useT();
  const field = useField();
  const [open, setOpen] = React.useState(false);
  const handleAdd = (value) => {
    const enabledSources = {};
    for (const key in value.sources) {
      if (value.sources[key].enabled) {
        enabledSources[key] = value.sources[key];
      }
    }
    value.sources = enabledSources;
    field.value = [...(field.value || []), value];
    setOpen(false);
  };
  return React.createElement(
    Card,
    {
      styles: {
        body: {
          padding: 0,
        },
      },
      extra: React.createElement(
        React.Fragment,
        null,
        React.createElement(
          Button,
          {
            size: 'small',
            variant: 'dashed',
            color: 'primary',
            icon: React.createElement(PlusOutlined, null),
            onClick: () => setOpen(true),
          },
          t('Add field'),
        ),
        React.createElement(InputsEditModal, {
          title: t('Add field'),
          open: open,
          onOk: handleAdd,
          onCancel: () => setOpen(false),
        }),
      ),
    },
    field.value && field.value.length
      ? React.createElement(List, {
          size: 'small',
          dataSource: field.value,
          renderItem: (item) => {
            return React.createElement(
              List.Item,
              {
                actions: [
                  React.createElement(Button, {
                    key: 'edit',
                    icon: React.createElement(EditOutlined, null),
                    type: 'text',
                  }),
                  React.createElement(Button, {
                    key: 'delete',
                    icon: React.createElement(DeleteOutlined, null),
                    type: 'text',
                  }),
                ],
              },
              React.createElement(List.Item.Meta, { title: item.title }),
              React.createElement(
                React.Fragment,
                null,
                Object.keys(item.sources || {}).map((source) => {
                  return React.createElement(
                    Tag,
                    {
                      style: {
                        marginBottom: '3px',
                      },
                      key: source,
                    },
                    t(inputSourceLabels[source]),
                  );
                }),
              ),
            );
          },
        })
      : React.createElement(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }),
  );
};
//# sourceMappingURL=InputsFormSettings.js.map
