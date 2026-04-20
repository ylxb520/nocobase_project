/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useContext } from 'react';
import { FlowContextProvider } from '../FlowContextProvider';
// 创建 FlowModel 上下文
const FlowModelReactContext = createContext(null);
/**
 * FlowModelProvider 组件
 * 用于在组件树中提供 FlowModel 实例
 */
export const FlowModelProvider = ({ model, children }) => {
  if (!model) {
    throw new Error('FlowModelProvider must be supplied with a model.');
  }
  return React.createElement(
    FlowModelReactContext.Provider,
    { value: model },
    React.createElement(FlowContextProvider, { context: model.context }, children),
  );
};
/**
 * useFlowModel Hook
 * 用于从上下文中获取 FlowModel 实例
 *
 * @returns {T} FlowModel 实例
 * @throws {Error} 如果在 FlowModelProvider 外部使用或未提供 model
 */
export function useFlowModel() {
  const model = useContext(FlowModelReactContext);
  if (!model) {
    throw new Error('useFlowModel must be used within a FlowModelProvider');
  }
  return model;
}
export function useFlowModelContext() {
  const model = useFlowModel();
  return model.context;
}
//# sourceMappingURL=useFlowModel.js.map
