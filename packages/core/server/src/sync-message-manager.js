/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class SyncMessageManager {
  app;
  options;
  versionManager;
  pubSubManager;
  constructor(app, options = {}) {
    this.app = app;
    this.options = options;
    this.versionManager = new SyncMessageVersionManager();
    app.on('beforeLoadPlugin', async (plugin) => {
      if (!plugin.name) {
        return;
      }
      await this.subscribe(plugin.name, plugin.handleSyncMessage.bind(plugin));
    });
  }
  get debounce() {
    return this.options.debounce || 1000;
  }
  async publish(channel, message, options) {
    const { transaction, ...others } = options || {};
    if (transaction) {
      return await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(
            new Error(
              `Publish message to ${channel} timeout, channel: ${channel}, message: ${JSON.stringify(message)}`,
            ),
          );
        }, 50000);
        transaction.afterCommit(async () => {
          try {
            const r = await this.app.pubSubManager.publish(`${this.app.name}.sync.${channel}`, message, {
              skipSelf: true,
              ...others,
            });
            resolve(r);
          } catch (error) {
            reject(error);
          } finally {
            clearTimeout(timer);
          }
        });
      });
    } else {
      return await this.app.pubSubManager.publish(`${this.app.name}.sync.${channel}`, message, {
        skipSelf: true,
        ...options,
      });
    }
  }
  async subscribe(channel, callback) {
    return await this.app.pubSubManager.subscribe(`${this.app.name}.sync.${channel}`, callback, {
      debounce: this.debounce,
    });
  }
  async unsubscribe(channel, callback) {
    return this.app.pubSubManager.unsubscribe(`${this.app.name}.sync.${channel}`, callback);
  }
  async sync() {
    // TODO
  }
}
export class SyncMessageVersionManager {}
//# sourceMappingURL=sync-message-manager.js.map
