/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { App, ConfigProvider } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FlowEngineProvider } from './provider';
function Provider({ config, engine, children }) {
  return React.createElement(
    FlowEngineProvider,
    { engine: engine },
    React.createElement(ConfigProvider, { ...config }, React.createElement(App, null, children)),
  );
}
export class ReactView {
  flowEngine;
  refreshCallback = null;
  constructor(flowEngine) {
    this.flowEngine = flowEngine;
  }
  createRoot(container, options = {}) {
    const root = createRoot(container, options);
    let currentChildren;
    const doRender = () => {
      root.render(
        React.createElement(
          Provider,
          { engine: this.flowEngine, config: this.flowEngine.context.antdConfig },
          currentChildren,
        ),
      );
    };
    const flowRoot = {
      render: (children) => {
        currentChildren = children;
        this.refreshCallback = doRender;
        doRender();
      },
      unmount: () => {
        this.refreshCallback = null;
        currentChildren = null;
        root.unmount();
      },
    };
    return flowRoot;
  }
  // 重新渲染当前根
  refresh() {
    if (this.refreshCallback) {
      this.refreshCallback();
    }
  }
  render(children, options = {}) {
    const container = document.createElement('span');
    const { onRendered } = options;
    let root;
    const renderContent = (root) => {
      const content = typeof children === 'function' ? children(root) : children;
      return React.createElement(
        Provider,
        { engine: this.flowEngine, config: this.flowEngine.context.antdConfig },
        content,
      );
    };
    if (onRendered) {
      onRendered(() => {
        root = createRoot(container);
        root.render(renderContent(root));
      });
    } else {
      root = createRoot(container);
      root.render(renderContent(root));
    }
    container._reactRoot = root;
    return container;
  }
  onRefReady(ref, cb, timeout = 10000) {
    const start = Date.now();
    function check() {
      if (ref.current) return cb(ref.current);
      if (Date.now() - start > timeout) return;
      setTimeout(check, 30);
    }
    check();
  }
}
//# sourceMappingURL=ReactView.js.map
