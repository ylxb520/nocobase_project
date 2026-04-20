/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { FlowEngine } from '../flowEngine';
import { FlowEngineProvider, useFlowEngine } from '../provider';
describe('FlowEngineProvider/useFlowEngine', () => {
  it('returns engine within provider', () => {
    const engine = new FlowEngine();
    const wrapper = ({ children }) => React.createElement(FlowEngineProvider, { engine: engine }, children);
    const { result } = renderHook(() => useFlowEngine(), { wrapper });
    expect(result.current).toBe(engine);
  });
});
//# sourceMappingURL=provider.test.js.map
