/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowRuntimeContext } from '../flowContext';
import { FlowModel } from '../models';
export declare const FlowSettingsContextProvider: ({
  value,
  children,
}: {
  value: any;
  children: any;
}) => React.JSX.Element;
/**
 * Hook to access the flow settings context
 * @returns {FlowRuntimeContext} The flow runtime context in settings mode
 */
export declare const useFlowSettingsContext: <TModel extends FlowModel<any> = FlowModel<any>>() => FlowRuntimeContext<
  TModel,
  any
>;
