/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css } from '@emotion/css';
import { Space, Tabs } from 'antd';
import React, { createElement, useContext } from 'react';
import { useCurrentDocumentTitle, usePlugin, useViewport } from '@nocobase/client';
import AuthPlugin from '..';
import { AuthenticatorsContext } from '../authenticator';
import { useAuthTranslation } from '../locale';
import { Schema } from '@formily/react';
export const useSignInForms = () => {
  const plugin = usePlugin(AuthPlugin);
  const authTypes = plugin.authTypes.getEntities();
  const signInForms = {};
  for (const [authType, options] of authTypes) {
    if (options.components?.SignInForm) {
      signInForms[authType] = options.components.SignInForm;
    }
  }
  return signInForms;
};
export const useSignInButtons = (authenticators = []) => {
  const plugin = usePlugin(AuthPlugin);
  const authTypes = plugin.authTypes.getEntities();
  const customs = {};
  for (const [authType, options] of authTypes) {
    if (options.components?.SignInButton) {
      customs[authType] = options.components.SignInButton;
    }
  }
  const types = Object.keys(customs);
  return authenticators
    .filter((authenticator) => types.includes(authenticator.authType))
    .map((authenticator, index) => React.createElement(customs[authenticator.authType], { key: index, authenticator }));
};
export const SignInPage = () => {
  const { t } = useAuthTranslation();
  useCurrentDocumentTitle('Signin');
  useViewport();
  const signInForms = useSignInForms();
  const authenticators = useContext(AuthenticatorsContext);
  const signInButtons = useSignInButtons(authenticators);
  if (!authenticators.length) {
    return React.createElement('div', { style: { color: '#ccc' } }, t('No authentication methods available.'));
  }
  const tabs = authenticators
    .map((authenticator) => {
      const C = signInForms[authenticator.authType];
      if (!C) {
        return;
      }
      const defaultTabTitle = `${t('Sign-in')} (${Schema.compile(
        authenticator.authTypeTitle || authenticator.authType,
        { t },
      )})`;
      return {
        component: createElement(C, { authenticator }),
        tabTitle: authenticator.title || defaultTabTitle,
        ...authenticator,
      };
    })
    .filter((i) => i);
  return React.createElement(
    Space,
    {
      direction: 'vertical',
      className: css`
        display: flex;
      `,
    },
    tabs.length > 1
      ? React.createElement(Tabs, {
          items: tabs.map((tab) => ({ label: tab.tabTitle, key: tab.name, children: tab.component })),
        })
      : tabs.length
      ? React.createElement('div', null, tabs[0].component)
      : React.createElement(React.Fragment, null),
    React.createElement(
      Space,
      {
        direction: 'vertical',
        className: css`
          display: flex;
        `,
      },
      signInButtons,
    ),
  );
};
//# sourceMappingURL=SignInPage.js.map
