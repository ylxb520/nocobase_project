/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/client';
import { Registry, tval } from '@nocobase/utils/client';
import { NAMESPACE } from './locale';
// import { UserDataSyncSource } from './UserDataSyncSource';
import { lazy } from '@nocobase/client';
const { UserDataSyncSource } = lazy(() => import('./UserDataSyncSource'), 'UserDataSyncSource');
export class PluginUserDataSyncClient extends Plugin {
    sourceTypes = new Registry();
    registerType(sourceType, options) {
        this.sourceTypes.register(sourceType, options);
    }
    // You can get and modify the app instance here
    async load() {
        this.app.pluginSettingsManager.add('users-permissions.sync', {
            title: tval('Synchronize', { ns: NAMESPACE }),
            icon: 'SyncOutlined',
            Component: UserDataSyncSource,
            sort: 99,
            aclSnippet: 'pm.user-data-sync',
        });
    }
}
export default PluginUserDataSyncClient;
//# sourceMappingURL=index.js.map