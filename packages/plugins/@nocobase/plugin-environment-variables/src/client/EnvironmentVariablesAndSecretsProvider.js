/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observer } from '@nocobase/flow-engine';
import { useIsLoggedIn, useRequest } from '@nocobase/client';
import React, { createContext } from 'react';
const EnvAndSecretsContext = createContext({});
const InternalProvider = (props) => {
  const variablesRequest = useRequest({
    url: 'environmentVariables?paginate=false',
  });
  return React.createElement(EnvAndSecretsContext.Provider, { value: { variablesRequest } }, props.children);
};
const EnvironmentVariablesAndSecretsProvider = observer(
  (props) => {
    const isLoggedIn = useIsLoggedIn();
    if (!isLoggedIn) {
      return React.createElement(React.Fragment, null, props.children);
    }
    return React.createElement(InternalProvider, { ...props });
  },
  {
    displayName: 'EnvironmentVariablesAndSecretsProvider',
  },
);
export { EnvAndSecretsContext, EnvironmentVariablesAndSecretsProvider };
//# sourceMappingURL=EnvironmentVariablesAndSecretsProvider.js.map
