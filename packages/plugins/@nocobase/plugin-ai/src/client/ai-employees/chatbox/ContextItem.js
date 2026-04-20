/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Tag, Modal, Typography } from 'antd';
import { useApp, usePlugin } from '@nocobase/client';
import _ from 'lodash';
const { Paragraph } = Typography;
export const ContextItem = ({ item, closable, onRemove, within }) => {
  const app = useApp();
  const [showContent, setShowContent] = React.useState(false);
  const plugin = usePlugin('ai');
  const workContext = plugin.aiManager.workContext;
  const options = useMemo(() => {
    const [rootKey, childKey] = item.type.split('.');
    if (!childKey) {
      return workContext.get(rootKey);
    }
    const root = workContext.get(rootKey);
    if (!root?.children) {
      return;
    }
    return root.children[childKey];
  }, [item.type, workContext]);
  const C = options?.tag?.Component;
  const getContent = options?.getContent;
  const [text, setText] = useState('');
  useEffect(() => {
    if (getContent) {
      getContent(app, item)
        .then((content) => {
          setText(_.isString(content) ? content : JSON.stringify(content, null, 2));
        })
        .catch(() => {
          // ignore
        });
    } else {
      setText(_.isString(item.content) ? item.content : JSON.stringify(item.content, null, 2));
    }
  }, [app, getContent, item, showContent]);
  return React.createElement(
    React.Fragment,
    null,
    within === 'chatbox' && options?.chatbox?.Component
      ? React.createElement(options.chatbox.Component, { item: item })
      : React.createElement(
          Tag,
          {
            onClick: () => setShowContent(true),
            closable: closable,
            onClose: () => {
              onRemove(item.type, item.uid);
            },
            style: {
              cursor: 'pointer',
              whiteSpace: 'normal',
            },
          },
          C ? React.createElement(C, { item: item }) : item.title,
        ),
    React.createElement(
      Modal,
      { open: showContent, onCancel: () => setShowContent(false), footer: null, width: '50%' },
      React.createElement(
        Paragraph,
        {
          copyable: {
            text: text,
          },
        },
        React.createElement(
          'pre',
          {
            style: {
              minHeight: '35vh',
              maxHeight: '70vh',
              overflowY: 'auto',
              marginTop: '24px',
            },
          },
          text,
        ),
      ),
    ),
  );
};
//# sourceMappingURL=ContextItem.js.map
