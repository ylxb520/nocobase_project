/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { parseValueToPath } from './utils';
import { useResolvedMetaTree } from './useResolvedMetaTree';
import { useRequest } from 'ahooks';
import { useFlowContext } from '../../FlowContextProvider';
export const InlineVariableTag = ({
  value,
  onRemove,
  className,
  style,
  allowEdit = true,
  metaTreeNode,
  metaTree,
  maxWidth = '400px',
}) => {
  const { resolvedMetaTree } = useResolvedMetaTree(metaTree);
  const ctx = useFlowContext();
  const { data: displayedValue } = useRequest(
    async () => {
      if (metaTreeNode) {
        return metaTreeNode.parentTitles
          ? [...metaTreeNode.parentTitles, metaTreeNode.title].map(ctx.t).join('/')
          : ctx.t(metaTreeNode.title) || '';
      }
      if (!value) return String(value);
      const path = parseValueToPath(value);
      return path ? path.join('/') : String(value);
    },
    { refreshDeps: [resolvedMetaTree, value, metaTreeNode] },
  );
  return React.createElement(
    Tag,
    {
      color: 'blue',
      closable: allowEdit && !!onRemove,
      onClose: (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove?.();
      },
      closeIcon: React.createElement(CloseOutlined, null),
      className: className,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        margin: 0,
        padding: '2px 6px',
        fontSize: '12px',
        lineHeight: '16px',
        height: '20px',
        borderRadius: '4px',
        maxWidth: maxWidth,
        cursor: 'default',
        userSelect: 'none',
        verticalAlign: 'middle',
        ...style,
      },
    },
    React.createElement(
      'span',
      {
        style: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        title: displayedValue,
      },
      displayedValue ?? '',
    ),
  );
};
//# sourceMappingURL=InlineVariableTag.js.map
