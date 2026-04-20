/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowEngineContext } from './flowContext';
import { FlowEngine } from './flowEngine';
interface FlowEngineProviderProps {
  engine: FlowEngine;
  children: React.ReactNode;
}
export declare const FlowEngineProvider: React.FC<FlowEngineProviderProps>;
export declare const FlowEngineGlobalsContextProvider: React.FC<{
  children: React.ReactNode;
}>;
export declare const useFlowEngine: ({ throwError }?: { throwError?: boolean }) => FlowEngine;
export declare const useFlowEngineContext: () => FlowEngineContext;
export {};
