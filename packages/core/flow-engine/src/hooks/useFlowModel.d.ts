/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowModelContext } from '../flowContext';
import { FlowModel } from '../models';
export interface FlowModelProviderProps {
  model: FlowModel;
  children: React.ReactNode;
}
/**
 * FlowModelProvider 组件
 * 用于在组件树中提供 FlowModel 实例
 */
export declare const FlowModelProvider: React.FC<FlowModelProviderProps>;
/**
 * useFlowModel Hook
 * 用于从上下文中获取 FlowModel 实例
 *
 * @returns {T} FlowModel 实例
 * @throws {Error} 如果在 FlowModelProvider 外部使用或未提供 model
 */
export declare function useFlowModel<T extends FlowModel = FlowModel>(): T;
export declare function useFlowModelContext<T extends FlowModelContext = FlowModelContext>(): T;
