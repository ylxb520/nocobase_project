/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { render } from '.';
import { addXReadPrettyToEachLayer, getAppComponent } from '../web';
import { WaitApp } from './utils';
export const renderAppOptions = async (options) => {
  const App = getAppComponent(options);
  const res = render(React.createElement(App, null));
  await WaitApp();
  return res;
};
export const renderReadPrettyApp = (options) => {
  return renderAppOptions({ ...options, schema: addXReadPrettyToEachLayer(options.schema) });
};
//# sourceMappingURL=renderAppOptions.js.map
