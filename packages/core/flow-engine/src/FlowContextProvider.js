/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useContext } from 'react';
export const FlowReactContext = createContext(null);
export const FlowViewContext = createContext(null);
export function FlowContextProvider(props) {
  return React.createElement(FlowReactContext.Provider, { value: props.context }, props.children);
}
export const FlowViewContextProvider = React.memo((props) => {
  return React.createElement(
    FlowViewContext.Provider,
    { value: props.context },
    React.createElement(FlowReactContext.Provider, { value: props.context }, props.children),
  );
});
FlowViewContextProvider.displayName = 'FlowViewContextProvider';
export function useFlowContext() {
  return useContext(FlowReactContext);
}
export function useFlowViewContext() {
  return useContext(FlowViewContext);
}
export function useFlowView() {
  const ctx = useFlowContext();
  return ctx.view;
}
//# sourceMappingURL=FlowContextProvider.js.map
