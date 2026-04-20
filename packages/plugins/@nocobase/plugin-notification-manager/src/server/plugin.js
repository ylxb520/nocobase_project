/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/server';
import NotificationManager from './manager';
export class PluginNotificationManagerServer extends Plugin {
    manager;
    logger;
    get channelTypes() {
        return this.manager.channelTypes;
    }
    registerChannelType(params) {
        this.manager.registerType(params);
    }
    async send(options) {
        return await this.manager.send(options);
    }
    async sendToUsers(options) {
        return await this.manager.sendToUsers(options);
    }
    async afterAdd() {
        this.logger = this.createLogger({
            dirname: 'notification-manager',
            filename: '%DATE%.log',
            transports: ['dailyRotateFile'],
        });
        this.manager = new NotificationManager({ plugin: this });
    }
    async beforeLoad() {
        this.app.resourceManager.registerActionHandler('messages:send', async (ctx, next) => {
            const sendOptions = ctx.action?.params?.values;
            this.manager.send(sendOptions);
            next();
        });
        this.app.acl.registerSnippet({
            name: 'pm.notification.channels',
            actions: ['notificationChannels:*'],
        });
        this.app.acl.registerSnippet({
            name: 'pm.notification.logs',
            actions: ['notificationSendLogs:*'],
        });
    }
    async load() { }
    async install() { }
    async afterEnable() { }
    async afterDisable() { }
    async remove() { }
}
export default PluginNotificationManagerServer;
//# sourceMappingURL=plugin.js.map