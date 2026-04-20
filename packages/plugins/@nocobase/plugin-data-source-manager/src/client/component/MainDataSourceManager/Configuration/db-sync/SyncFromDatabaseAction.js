/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Dropdown, Button, App, message } from 'antd';
import { ImportOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';
import LoadCollection from './LoadCollectionAction';
import { useAPIClient, useDataSource } from '@nocobase/client';
import { useDSMTranslation } from '../../../../locale';
export const SyncFromDatabaseAction = () => {
  const { t } = useDSMTranslation();
  const api = useAPIClient();
  const { modal } = App.useApp();
  const ds = useDataSource();
  return React.createElement(
    Dropdown,
    {
      menu: {
        items: [
          {
            key: 'load-tables',
            label: React.createElement(LoadCollection, null),
            icon: React.createElement(ImportOutlined, null),
          },
          {
            key: 'sync-fields',
            label: t('Sync field changes from database'),
            icon: React.createElement(ReloadOutlined, null),
            onClick: async () => {
              modal.confirm({
                title: t('Sync field changes from database'),
                content: t('Field synchronization confirmation prompt'),
                onOk: async () => {
                  await api.resource('mainDataSource').syncFields();
                  ds.reload();
                  message.success(t('Sync successfully'));
                },
              });
            },
          },
        ],
      },
      placement: 'bottomLeft',
    },
    React.createElement(Button, { icon: React.createElement(SyncOutlined, null) }, t('Sync from database')),
  );
};
//# sourceMappingURL=SyncFromDatabaseAction.js.map
