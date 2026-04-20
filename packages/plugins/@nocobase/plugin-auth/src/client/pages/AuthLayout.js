/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css } from '@emotion/css';
import {
  PoweredBy,
  ReadPretty,
  SwitchLanguage,
  useAPIClient,
  useRequest,
  useSystemSettings,
  useToken,
} from '@nocobase/client';
import { Spin } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthenticatorsContext } from '../authenticator';
export const AuthenticatorsContextProvider = ({ children }) => {
  const api = useAPIClient();
  const { data: authenticators = [], error, loading } = useRequest(() =>
    api
      .resource('authenticators')
      .publicList()
      .then((res) => {
        return res?.data?.data || [];
      }),
  );
  if (loading) {
    return React.createElement(
      'div',
      { style: { textAlign: 'center', marginTop: 20 } },
      React.createElement(Spin, null),
    );
  }
  if (error) {
    throw error;
  }
  return React.createElement(AuthenticatorsContext.Provider, { value: authenticators }, children);
};
export function AuthLayout() {
  const { data } = useSystemSettings() || {};
  const { token } = useToken();
  const { t } = useTranslation('lm-collections');
  return React.createElement(
    'div',
    {
      style: {
        maxWidth: 320,
        margin: '0 auto',
        paddingTop: '20vh',
        paddingBottom: '20vh',
      },
    },
    React.createElement(
      'div',
      { style: { position: 'fixed', top: '2em', right: '2em' } },
      React.createElement(SwitchLanguage, null),
    ),
    React.createElement(
      'h1',
      { style: { textAlign: 'center' } },
      React.createElement(ReadPretty.TextArea, { value: t(data?.data?.title) }),
    ),
    React.createElement(AuthenticatorsContextProvider, null, React.createElement(Outlet, null)),
    React.createElement(
      'div',
      {
        className: css`
          position: absolute;
          bottom: 0;
          width: 100%;
          left: 0;
          text-align: center;
          padding-bottom: 24px;
          background-color: ${token.colorBgContainer};
        `,
      },
      React.createElement(PoweredBy, null),
    ),
  );
}
//# sourceMappingURL=AuthLayout.js.map
