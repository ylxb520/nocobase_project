/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { uid } from '@nocobase/utils';
import { HandlerManager } from './handler-manager';
export const createPubSubManager = (app, options) => {
  const pubSubManager = new PubSubManager(app, options);
  app.on('afterStart', async () => {
    await pubSubManager.connect();
  });
  app.on('afterStop', async () => {
    await pubSubManager.close();
  });
  return pubSubManager;
};
export class PubSubManager {
  app;
  options;
  publisherId;
  adapter;
  handlerManager;
  constructor(app, options = {}) {
    this.app = app;
    this.options = options;
    this.publisherId = uid();
    this.handlerManager = new HandlerManager(this.publisherId);
  }
  setAdapter(adapter) {
    this.adapter = adapter;
  }
  getFullChannel(channel) {
    return [this.app.name, this.options?.channelPrefix, channel].filter(Boolean).join('.');
  }
  async isConnected() {
    if (this.adapter) {
      return this.adapter.isConnected();
    }
    return false;
  }
  async connect() {
    if (!this.adapter) {
      return;
    }
    await this.adapter.connect();
    // 如果没连接前添加的订阅，连接后需要把订阅添加上
    await this.handlerManager.each(async (channel, headler) => {
      this.app.logger.debug(`[PubSubManager] subscribe ${channel} added before connected`);
      await this.adapter.subscribe(this.getFullChannel(channel), headler);
    });
  }
  async close() {
    if (!this.adapter) {
      return;
    }
    return await this.adapter.close();
  }
  async subscribe(channel, callback, options = {}) {
    // 先退订，防止重复订阅
    await this.unsubscribe(channel, callback);
    const handler = this.handlerManager.set(channel, callback, options);
    // 连接之后才能订阅
    if (await this.isConnected()) {
      this.app.logger.debug(`[PubSubManager] subscribe ${channel} added after connected`);
      await this.adapter.subscribe(this.getFullChannel(channel), handler);
    }
  }
  async unsubscribe(channel, callback) {
    const handler = this.handlerManager.delete(channel, callback);
    if (!this.adapter || !handler) {
      return;
    }
    return this.adapter.unsubscribe(this.getFullChannel(channel), handler);
  }
  async publish(channel, message, options) {
    if (!this.adapter?.isConnected()) {
      this.app.logger.warn(
        `[PubSubManager] adapter is not exist or not connected, cannot publish message to channel ${channel}`,
      );
      return;
    }
    const wrappedMessage = JSON.stringify({
      publisherId: this.publisherId,
      ...options,
      message: message,
    });
    await this.adapter.publish(this.getFullChannel(channel), wrappedMessage);
    this.app.logger.trace(`[PubSubManager] published message to channel ${channel}`);
  }
}
//# sourceMappingURL=pub-sub-manager.js.map
