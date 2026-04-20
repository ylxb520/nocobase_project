/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
import { Application } from '@nocobase/server';
import { merge } from '@nocobase/utils';
export class ApplicationModel extends Model {
    registerToSupervisor(mainApp, options) {
        const appName = this.get('name');
        const appModelOptions = this.get('options') || {};
        const appOptions = options.appOptionsFactory(appName, mainApp);
        const subAppOptions = {
            ...merge(appOptions, appModelOptions),
            name: appName,
        };
        const subApp = new Application(subAppOptions);
        subApp.on('afterStart', () => {
            mainApp.emit('subAppStarted', subApp);
        });
        return subApp;
    }
}
//# sourceMappingURL=application.js.map