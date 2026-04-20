/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { RenderElementProps } from 'slate-react';
import type { VariableTriggerElement } from './types';
import type { MetaTreeNode } from '../../flowContext';
interface VariableTriggerProps extends RenderElementProps {
  element: VariableTriggerElement;
  metaTree?: MetaTreeNode[] | (() => MetaTreeNode[] | Promise<MetaTreeNode[]>);
  onVariableSelect?: (triggerId: string, value: string, item: MetaTreeNode) => void;
  onTriggerClose?: (triggerId: string) => void;
}
export declare const VariableTrigger: React.FC<VariableTriggerProps>;
export {};
