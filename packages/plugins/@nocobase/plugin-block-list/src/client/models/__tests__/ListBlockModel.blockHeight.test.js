/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useRef } from 'react';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useListHeight } from '../utils';
const createRect = (height) => ({
  x: 0,
  y: 0,
  width: 100,
  height,
  top: 0,
  left: 0,
  right: 100,
  bottom: height,
  toJSON: () => {},
});
const setRect = (node, height) => {
  if (!node) return;
  node.getBoundingClientRect = () => createRect(height);
};
const HeightProbe = ({ heightMode, containerHeight, actionsHeight, paginationHeight, depsKey }) => {
  const containerRef = useRef(null);
  const actionsRef = useRef(null);
  const listRef = useRef(null);
  const listHeight = useListHeight({
    heightMode,
    containerRef,
    actionsRef,
    listRef,
    deps: [depsKey],
  });
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      {
        ref: (node) => {
          containerRef.current = node;
          setRect(node, containerHeight);
        },
      },
      React.createElement('div', {
        ref: (node) => {
          actionsRef.current = node;
          setRect(node, actionsHeight);
        },
      }),
      React.createElement(
        'div',
        {
          ref: (node) => {
            listRef.current = node;
          },
        },
        React.createElement('div', {
          className: 'ant-list-pagination',
          ref: (node) => {
            setRect(node, paginationHeight);
          },
        }),
      ),
    ),
    React.createElement(
      'span',
      { 'data-testid': 'list-height' },
      listHeight === undefined ? 'undefined' : String(listHeight),
    ),
  );
};
describe('ListBlockModel block height', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  beforeAll(() => {
    if (typeof globalThis.ResizeObserver === 'undefined') {
      globalThis.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
  });
  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });
  it('calculates list height when heightMode is fixed', async () => {
    render(
      React.createElement(HeightProbe, {
        heightMode: 'specifyValue',
        containerHeight: 400,
        actionsHeight: 40,
        paginationHeight: 20,
        depsKey: 1,
      }),
    );
    await waitFor(() => {
      expect(screen.getByTestId('list-height').textContent).toBe('340');
    });
  });
  it('clears list height when heightMode is not fixed', async () => {
    const { rerender } = render(
      React.createElement(HeightProbe, {
        heightMode: 'specifyValue',
        containerHeight: 400,
        actionsHeight: 40,
        paginationHeight: 20,
        depsKey: 1,
      }),
    );
    await waitFor(() => {
      expect(screen.getByTestId('list-height').textContent).toBe('340');
    });
    rerender(
      React.createElement(HeightProbe, {
        heightMode: 'default',
        containerHeight: 400,
        actionsHeight: 40,
        paginationHeight: 20,
        depsKey: 2,
      }),
    );
    await waitFor(() => {
      expect(screen.getByTestId('list-height').textContent).toBe('undefined');
    });
  });
});
//# sourceMappingURL=ListBlockModel.blockHeight.test.js.map
