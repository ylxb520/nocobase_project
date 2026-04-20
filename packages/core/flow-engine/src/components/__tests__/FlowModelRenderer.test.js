/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { FlowEngine } from '../../flowEngine';
import { FlowModel } from '../../models/flowModel';
import { FlowEngineProvider } from '../../provider';
import { FlowModelRenderer } from '../FlowModelRenderer';
describe('FlowModelRenderer', () => {
  let flowEngine;
  let model;
  beforeEach(() => {
    flowEngine = new FlowEngine();
    model = new FlowModel({
      uid: 'test-model',
      flowEngine,
    });
    // Mock dispatchEvent to track calls
    model.dispatchEvent = vi.fn().mockResolvedValue([]);
    // Mock render to return something
    model.render = vi.fn().mockReturnValue(React.createElement('div', null, 'Model Content'));
  });
  const renderWithProvider = (ui) => {
    return render(React.createElement(FlowEngineProvider, { engine: flowEngine }, ui));
  };
  test('should pass useCache to useApplyAutoFlows and set it on context', async () => {
    const { unmount } = renderWithProvider(React.createElement(FlowModelRenderer, { model: model, useCache: true }));
    // Check if dispatchEvent was called with useCache: true
    // useApplyAutoFlows calls dispatchEvent('beforeRender', inputArgs, { useCache })
    await waitFor(() => {
      expect(model.dispatchEvent).toHaveBeenCalledWith(
        'beforeRender',
        undefined,
        expect.objectContaining({ useCache: true }),
      );
    });
    // Check if useCache is set on context
    expect(model.context.useCache).toBe(true);
    unmount();
  });
  test('should pass useCache=false to useApplyAutoFlows and set it on context', async () => {
    const { unmount } = renderWithProvider(React.createElement(FlowModelRenderer, { model: model, useCache: false }));
    await waitFor(() => {
      expect(model.dispatchEvent).toHaveBeenCalledWith(
        'beforeRender',
        undefined,
        expect.objectContaining({ useCache: false }),
      );
    });
    expect(model.context.useCache).toBe(false);
    unmount();
  });
  test('should not pass useCache if not provided', async () => {
    const { unmount } = renderWithProvider(React.createElement(FlowModelRenderer, { model: model }));
    await waitFor(() => {
      expect(model.dispatchEvent).toHaveBeenCalledWith(
        'beforeRender',
        undefined,
        expect.objectContaining({ useCache: undefined }),
      );
    });
    // context.useCache should be undefined (or default)
    expect(model.context.useCache).toBeUndefined();
    unmount();
  });
});
//# sourceMappingURL=FlowModelRenderer.test.js.map
