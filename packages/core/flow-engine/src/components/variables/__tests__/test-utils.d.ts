/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowContext } from '../../../flowContext';
/**
 * Test wrapper component that provides FlowContext to child components
 */
export declare function TestFlowContextWrapper({
  context,
  children,
}: {
  context: FlowContext;
  children: React.ReactNode;
}): React.JSX.Element;
/**
 * Create a test FlowContext with consistent data for testing
 */
export declare function createTestFlowContext(): FlowContext;
