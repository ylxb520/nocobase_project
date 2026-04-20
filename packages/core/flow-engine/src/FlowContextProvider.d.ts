/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowContext, FlowEngineContext } from './flowContext';
import { FlowView } from './views/FlowView';
export declare const FlowReactContext: React.Context<FlowContext>;
export declare const FlowViewContext: React.Context<FlowContext>;
export declare function FlowContextProvider(props: {
  children: React.ReactNode;
  context: FlowContext;
}): React.JSX.Element;
export declare const FlowViewContextProvider: React.MemoExoticComponent<
  (props: { children: React.ReactNode; context: FlowContext }) => React.JSX.Element
>;
export declare function useFlowContext<T = FlowEngineContext>(): T;
export declare function useFlowViewContext<T = FlowEngineContext>(): T;
export declare function useFlowView(): FlowView;
