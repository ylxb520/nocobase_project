/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CodeOutlined } from '@ant-design/icons';
import { useT } from '../../locale';
import { Space } from 'antd';
export const CodeEditorContext = {
  name: 'code-editor',
  tag: {
    Component: ({ item }) => {
      const t = useT();
      return React.createElement(
        Space,
        null,
        React.createElement(CodeOutlined, null),
        React.createElement('span', null, item.title),
      );
    },
  },
  getContent: async (_app, { content }) => {
    return content?.code;
  },
};
import React from 'react';
//# sourceMappingURL=code-editor.js.map
