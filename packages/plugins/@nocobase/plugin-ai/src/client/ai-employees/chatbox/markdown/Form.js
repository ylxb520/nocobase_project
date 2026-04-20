/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo, useState } from 'react';
import { SchemaComponent } from '@nocobase/client';
import { uid } from '@formily/shared';
import { createForm } from '@formily/core';
import { useT } from '../../../locale';
import { Generating } from './Generating';
import { Alert } from 'antd';
import { CodeInternal } from './Code';
import { useChatConversationsStore } from '../stores/chat-conversations';
import { useChatMessagesStore } from '../stores/chat-messages';
import { useChatBoxStore } from '../stores/chat-box';
function getFormV2Properties(schema) {
  const result = {};
  const traverse = (node) => {
    if (typeof node !== 'object' || node === null) return;
    if (node['x-component'] === 'CollectionField' && typeof node.name === 'string') {
      result[node.name] = {
        ...node,
      };
    }
    if (node.properties && typeof node.properties === 'object') {
      for (const key in node.properties) {
        traverse(node.properties[key]);
      }
    }
  };
  traverse(schema);
  return result;
}
function replaceFormContentByUid(content, uid, values) {
  const pattern = new RegExp(`<form\\b[^>]*\\buid=["']${uid}["'][^>]*>([\\s\\S]*?)<\\/form>`, 'gi');
  return content.replace(pattern, (match, oldValues) => {
    return match.replace(oldValues, values);
  });
}
export const Form = (props) => {
  const t = useT();
  const currentEmployee = useChatBoxStore.use.currentEmployee();
  const currentConversation = useChatConversationsStore.use.currentConversation();
  const responseLoading = useChatMessagesStore.use.responseLoading();
  // const { resendMessages, messagesService, updateMessage } = useChatMessageActions();
  const { children, node, message } = props;
  const { uid: formUid, datasource: dataSource, collection } = node.properties;
  const fieldSchema = null;
  const fields = useMemo(() => {
    if (!fieldSchema) {
      return {};
    }
    return getFormV2Properties(fieldSchema.toJSON());
  }, [fieldSchema]);
  const valuesStr = String(children).replace(/\n$/, '');
  const [editable, setEditable] = useState(false);
  let invalid = false;
  let values;
  try {
    values = JSON.parse(valuesStr);
  } catch (error) {
    invalid = true;
  }
  const form = useMemo(
    () =>
      createForm({
        initialValues: values,
      }),
    [values],
  );
  if (responseLoading && !message.messageId) {
    return React.createElement(Generating, null);
  }
  if (invalid) {
    return React.createElement(Alert, {
      type: 'warning',
      message: React.createElement(
        React.Fragment,
        null,
        t('The current result is not a valid form object. Please ask the AI employee to regenerate it.'),
        React.createElement(CodeInternal, { language: 'json', value: valuesStr }),
      ),
      style: {
        marginBottom: '16px',
      },
    });
  }
  const properties = Object.keys(values).reduce((acc, key) => {
    acc[key] = {
      type: fields[key]?.type || 'string',
      'x-decorator': 'FormItem',
      'x-component': 'CollectionField',
      'x-component-props': fields[key]?.['x-component-props'] || {},
      'x-collection-field': fields[key]?.['x-collection-field'],
      'x-read-pretty': !editable,
    };
    return acc;
  }, {});
  return React.createElement(
    'div',
    {
      style: {
        marginBottom: '16px',
      },
    },
    React.createElement(SchemaComponent, {
      schema: {
        type: 'void',
        name: uid(),
        properties: {
          [uid()]: {
            type: 'void',
            'x-component': 'FormBlockProvider',
            'x-component-props': {
              collection,
              dataSource,
            },
            properties: {
              form: {
                'x-component': 'FormV2',
                'x-component-props': {
                  form,
                },
                properties: {
                  ...properties,
                  fillOut: {
                    type: 'void',
                    'x-component': 'Action',
                    title: t('Fill out'),
                    'x-component-props': {
                      icon: 'FormOutlined',
                      variant: 'outlined',
                      color: 'primary',
                      size: 'small',
                      onClick: async () => {
                        await form.submit();
                        // const targetForm = ctx[formUid]?.form;
                        // if (targetForm) {
                        //   targetForm.setValues(form.values);
                        // }
                      },
                    },
                  },
                  edit: {
                    type: 'void',
                    'x-component': 'Action',
                    title: editable ? t('Save') : t('Edit'),
                    'x-component-props': {
                      style: {
                        marginLeft: '8px',
                      },
                      icon: editable ? 'SaveOutlined' : 'EditOutlined',
                      variant: 'outlined',
                      size: 'small',
                      onClick: async () => {
                        if (!editable) {
                          setEditable(!editable);
                          return;
                        }
                        const content = replaceFormContentByUid(message.content, formUid, JSON.stringify(form.values));
                        // await updateMessage({
                        //   sessionId: currentConversation,
                        //   messageId: message.messageId,
                        //   content: {
                        //     type: 'text',
                        //     content,
                        //   },
                        // });
                      },
                    },
                  },
                  cancel: {
                    type: 'void',
                    'x-component': 'Action',
                    title: t('Cancel'),
                    'x-display': editable ? 'visible' : 'hidden',
                    'x-component-props': {
                      style: {
                        marginLeft: '8px',
                      },
                      icon: 'CloseOutlined',
                      variant: 'outlined',
                      size: 'small',
                      onClick: () => {
                        setEditable(false);
                        form.reset();
                      },
                    },
                  },
                  // resend: {
                  //   type: 'void',
                  //   'x-component': 'Action',
                  //   title: t('Regenerate'),
                  //   'x-component-props': {
                  //     style: {
                  //       marginLeft: '8px',
                  //     },
                  //     icon: 'ReloadOutlined',
                  //     variant: 'outlined',
                  //     size: 'small',
                  //     onClick: () => {
                  //       resendMessages({
                  //         sessionId: currentConversation,
                  //         messageId: message.messageId,
                  //         aiEmployee: currentEmployee,
                  //       });
                  //     },
                  //   },
                  // },
                },
              },
            },
          },
        },
      },
    }),
  );
};
//# sourceMappingURL=Form.js.map
