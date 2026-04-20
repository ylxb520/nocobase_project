/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useContext } from 'react';
import { useAPIClient, useRequest } from '@nocobase/client';
import { createContext } from 'react';
export const AISettingsContext = createContext({});
export const AISettingsProvider = (props) => {
  const api = useAPIClient();
  const { data } = useRequest(() =>
    api
      .resource('aiSettings')
      .publicGet()
      .then((res) => res?.data?.data),
  );
  return React.createElement(AISettingsContext.Provider, { value: data }, props.children);
};
export const useAISettingsContext = () => {
  const ctx = useContext(AISettingsContext);
  return ctx;
};
//# sourceMappingURL=AISettingsProvider.js.map
