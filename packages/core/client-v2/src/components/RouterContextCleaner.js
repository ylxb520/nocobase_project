/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { UNSAFE_LocationContext, UNSAFE_RouteContext } from 'react-router-dom';
export const RouterContextCleaner = React.memo((props) => {
  return React.createElement(
    UNSAFE_RouteContext.Provider,
    {
      value: {
        outlet: null,
        matches: [],
        isDataRoute: false,
      },
    },
    React.createElement(UNSAFE_LocationContext.Provider, { value: null }, props.children),
  );
});
RouterContextCleaner.displayName = 'RouterContextCleaner';
//# sourceMappingURL=RouterContextCleaner.js.map
