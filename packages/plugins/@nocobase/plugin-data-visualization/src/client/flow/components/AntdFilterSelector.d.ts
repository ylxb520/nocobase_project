/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import type { CSSProperties } from 'react';
import type { VariableFilterItemValue } from '@nocobase/client';
import type { FlowModel } from '@nocobase/flow-engine';
type LogicOp = '$and' | '$or';
export type FilterCondition = VariableFilterItemValue;
export type FilterGroupValue = {
  logic: LogicOp;
  items: Array<FilterCondition | FilterGroupValue>;
};
export interface AntdFilterSelectorProps {
  value?: FilterGroupValue;
  onChange?: (next: FilterGroupValue) => void;
  model: FlowModel;
  rightAsVariable?: boolean;
  collectionPath?: string[];
  className?: string;
  style?: CSSProperties;
}
/**
 * AntdFilterSelector
 * - antd Form.Item 子组件
 * - 内部用响应式对象驱动 FilterGroup/VariableFilterItem
 * - reaction 桥接所有深层变更为 antd 的 onChange
 */
export declare const AntdFilterSelector: React.FC<AntdFilterSelectorProps>;
export default AntdFilterSelector;
