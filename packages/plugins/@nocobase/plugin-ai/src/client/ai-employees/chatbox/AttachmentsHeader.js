/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo } from 'react';
import { Attachments } from '@ant-design/x';
import { css } from '@emotion/css';
import { useChatMessagesStore } from './stores/chat-messages';
export const AttachmentsHeader = () => {
  const attachments = useChatMessagesStore.use.attachments();
  const removeAttachment = useChatMessagesStore.use.removeAttachment();
  const items = useMemo(() => {
    return attachments?.map((item) => ({
      uid: item.uid || item.filename,
      name: item.filename || item.name,
      status: item.status ?? 'done',
      url: item.url,
      size: item.size,
      thumbUrl: item.preview,
      ...item,
    }));
  }, [attachments]);
  if (!items?.length) {
    return null;
  }
  const wrapperClassName = css`
    .ant-attachment-list-card .ant-image img {
      height: 60px;
      width: 60px;
      object-fit: cover;
    }
  `;
  return React.createElement(
    'div',
    {
      className: wrapperClassName,
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
      },
    },
    items.map((item) =>
      React.createElement(Attachments.FileCard, {
        key: item.uid,
        item: item,
        onRemove: (item) => removeAttachment(item.name),
      }),
    ),
  );
};
//# sourceMappingURL=AttachmentsHeader.js.map
