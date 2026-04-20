/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { BlankComponent } from '../components';
export function normalizeContainer(container) {
  if (!container) {
    console.warn(`Failed to mount app: mount target should not be null or undefined.`);
    return null;
  }
  if (typeof container === 'string') {
    const res = document.querySelector(container);
    if (!res) {
      console.warn(`Failed to mount app: mount target selector "${container}" returned null.`);
    }
    return res;
  }
  if (window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === 'closed') {
    console.warn(`mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`);
  }
  return container;
}
export const compose = (...components) => {
  const Component = components.reduce((Parent, child) => {
    const [Child, childProps] = child;
    const ComposeComponent = ({ children }) =>
      React.createElement(Parent, null, React.createElement(Child, { ...childProps }, children));
    ComposeComponent.displayName = `compose(${Child.displayName || Child.name})`;
    return ComposeComponent;
  }, BlankComponent);
  return (LastChild) => (props) => {
    return React.createElement(Component, null, LastChild && React.createElement(LastChild, { ...props }));
  };
};
//# sourceMappingURL=index.js.map
