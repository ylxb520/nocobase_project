/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { lazy } from '@nocobase/client';
import React from 'react';
// import { GeneralPermissions } from './permissions/GeneralPermissions';
// import { MenuItemsProvider } from './permissions/MenuItemsProvider';
// import { MenuPermissions } from './permissions/MenuPermissions';
const { GeneralPermissions } = lazy(() => import('./permissions/GeneralPermissions'), 'GeneralPermissions');
// const { MenuItemsProvider } = lazy(() => import('./permissions/MenuItemsProvider'), 'MenuItemsProvider');
const { MenuPermissions } = lazy(() => import('./permissions/MenuPermissions'), 'MenuPermissions');
import { DesktopAllRoutesProvider } from './permissions/MenuPermissions';
/**
 * the extension API for ACL settings page
 */
export class ACLSettingsUI {
  permissionsTabs = [
    ({ t, TabLayout }) => ({
      key: 'general',
      label: t('System'),
      sort: 10,
      children: React.createElement(TabLayout, null, React.createElement(GeneralPermissions, null)),
    }),
    ({ activeKey, t, TabLayout }) => ({
      key: 'menu',
      label: t('Desktop routes'),
      sort: 20,
      children: React.createElement(
        TabLayout,
        null,
        React.createElement(
          DesktopAllRoutesProvider,
          { active: activeKey === 'menu' },
          React.createElement(MenuPermissions, { active: activeKey === 'menu' }),
        ),
      ),
    }),
  ];
  addPermissionsTab(tab) {
    this.permissionsTabs.push(tab);
  }
  getPermissionsTabs(props) {
    return this.permissionsTabs
      .map((tab) => {
        if (typeof tab === 'function') {
          return tab(props);
        }
        return tab;
      })
      .sort((a, b) => (a?.sort ?? 100) - (b?.sort ?? 100));
  }
}
//# sourceMappingURL=ACLSettingsUI.js.map
