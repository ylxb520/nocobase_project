/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useT } from '../../locale';
import { Space, Spin } from 'antd';
import { useChatMessagesStore } from './stores/chat-messages';
import { SearchOutlined } from '@ant-design/icons';
import { useToken } from '@nocobase/client';
import { Typography } from 'antd';
const { Paragraph } = Typography;
export const AIThinking = ({ nickname }) => {
  const t = useT();
  const webSearching = useChatMessagesStore.use.webSearching();
  const { token } = useToken();
  return React.createElement(
    Space,
    { direction: 'vertical' },
    React.createElement(
      Space,
      {
        direction: 'horizontal',
        style: {
          color: token.colorTextDescription,
          fontStyle: 'italic',
        },
      },
      React.createElement(Spin, { indicator: React.createElement(LoadingOutlined, { spin: true }) }),
      webSearching ? t('AI is searching', { nickname }) : t('AI is thinking', { nickname }),
    ),
    webSearching?.query &&
      React.createElement(
        Paragraph,
        null,
        React.createElement('blockquote', null, React.createElement(SearchOutlined, null), ' ', webSearching.query),
      ),
  );
};
//# sourceMappingURL=AIThinking.js.map
