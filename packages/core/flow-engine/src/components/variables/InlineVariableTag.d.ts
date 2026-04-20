/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import type { MetaTreeNode } from '../../flowContext';
export interface InlineVariableTagProps {
  value?: string;
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
  allowEdit?: boolean;
  metaTreeNode: MetaTreeNode;
  metaTree?: MetaTreeNode[] | (() => MetaTreeNode[] | Promise<MetaTreeNode[]>);
  maxWidth?: string | number;
}
export declare const InlineVariableTag: React.FC<InlineVariableTagProps>;
