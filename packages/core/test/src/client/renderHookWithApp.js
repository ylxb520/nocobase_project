/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { Fragment } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { getApp } from '../web';
import { WaitApp } from './utils';
export const renderHookWithApp = async (options) => {
  const { hook: useHook, props, Wrapper = Fragment, ...otherOptions } = options;
  const { App } = getApp(otherOptions);
  const WrapperValue = ({ children }) => React.createElement(App, null, React.createElement(Wrapper, null, children));
  const res = renderHook(() => useHook(), { wrapper: WrapperValue, initialProps: props });
  await WaitApp();
  return res;
};
//# sourceMappingURL=renderHookWithApp.js.map
