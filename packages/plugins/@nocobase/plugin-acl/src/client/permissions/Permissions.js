/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useACLRoleContext, useAPIClient, usePlugin, useRequest } from '@nocobase/client';
import { Tabs } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';
import PluginACLClient from '..';
import { RolesManagerContext } from '../RolesManagerProvider';
import { useACLTranslation } from '../locale';
import { AvailableActionsProvider } from './AvailableActions';
const TabLayout = (props) => {
  return React.createElement('div', { style: { maxHeight: '60vh', overflowY: 'auto' } }, props.children);
};
export const Permissions = ({ active }) => {
  const { t } = useACLTranslation();
  const [activeKey, setActiveKey] = React.useState('general');
  const { role, setRole } = useContext(RolesManagerContext);
  const pluginACLClient = usePlugin(PluginACLClient);
  const currentUserRole = useACLRoleContext();
  const items = useMemo(
    () =>
      pluginACLClient.settingsUI
        .getPermissionsTabs({ t, activeKey, TabLayout, activeRole: role, currentUserRole })
        .filter(Boolean),
    [activeKey, pluginACLClient.settingsUI, role, t, currentUserRole],
  );
  const api = useAPIClient();
  const { data } = useRequest(
    () =>
      api
        .resource('roles')
        .get({
          filterByTk: role?.name,
        })
        .then((res) => {
          const record = res?.data?.data;
          record.snippets?.forEach((key) => {
            record[key] = true;
          });
          return record;
        }),
    {
      ready: active && !!role,
      refreshDeps: [role?.name],
    },
  );
  useEffect(() => {
    setActiveKey('general');
  }, [role?.name]);
  useEffect(() => {
    setRole(data);
  }, [data, setRole]);
  return React.createElement(
    AvailableActionsProvider,
    null,
    React.createElement(Tabs, {
      type: 'card',
      activeKey: activeKey,
      onChange: (key) => setActiveKey(key),
      items: items,
    }),
  );
};
//# sourceMappingURL=Permissions.js.map
