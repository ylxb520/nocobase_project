/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs/promises';
import { sleep } from '@nocobase/utils';
export const QUEUE_DEFAULT_INTERVAL = 250;
export const QUEUE_DEFAULT_CONCURRENCY = 1;
export const QUEUE_DEFAULT_ACK_TIMEOUT = 15_000;
export class MemoryEventQueueAdapter {
  options;
  connected = false;
  emitter = new EventEmitter();
  reading = new Map();
  events = new Map();
  queues = new Map();
  get processing() {
    const processing = Array.from(this.reading.values());
    if (processing.length > 0) {
      return Promise.all(processing);
    }
    return null;
  }
  get storagePath() {
    return path.resolve(process.cwd(), 'storage', 'apps', this.options.appName, 'event-queue.json');
  }
  listen = (channel) => {
    if (!this.connected) {
      return;
    }
    const { logger } = this.options;
    const event = this.events.get(channel);
    if (!event) {
      logger.warn(`memory queue (${channel}) not found, skipping...`);
      return;
    }
    if (!event.idle()) {
      return;
    }
    const reading = this.reading.get(channel) || [];
    const count = (event.concurrency || QUEUE_DEFAULT_CONCURRENCY) - reading.length;
    if (count <= 0) {
      // logger.debug(
      //   `memory queue (${channel}) is already reading as max concurrency (${reading.length}), waiting last reading to end...`,
      // );
      return;
    }
    logger.debug(`reading more from queue (${channel}), count: ${count}`);
    this.read(channel, count).forEach((promise) => {
      reading.push(promise);
      // eslint-disable-next-line promise/catch-or-return
      promise.finally(() => {
        const index = reading.indexOf(promise);
        if (index > -1) {
          reading.splice(index, 1);
        }
      });
    });
    this.reading.set(channel, reading);
  };
  constructor(options) {
    this.options = options;
    this.emitter.setMaxListeners(0);
  }
  isConnected() {
    return this.connected;
  }
  setConnected(connected) {
    this.connected = connected;
  }
  async loadFromStorage() {
    let queues = {};
    let exists = false;
    const { logger } = this.options;
    try {
      await fs.stat(this.storagePath);
      exists = true;
    } catch (ex) {
      logger.info(`memory queue storage file not found, skip`);
    }
    if (exists) {
      try {
        const queueJson = await fs.readFile(this.storagePath);
        queues = JSON.parse(queueJson.toString());
        logger.debug('memory queue loaded from storage', queues);
        await fs.unlink(this.storagePath);
      } catch (ex) {
        logger.error('failed to load queue from storage', ex);
      }
    }
    this.queues = new Map(Object.entries(queues));
  }
  async saveToStorage() {
    const queues = Array.from(this.queues.entries()).reduce((acc, [channel, queue]) => {
      if (queue?.length) {
        acc[channel] = queue;
      }
      return acc;
    }, {});
    const { logger } = this.options;
    if (Object.keys(queues).length) {
      await fs.mkdir(path.dirname(this.storagePath), { recursive: true });
      await fs.writeFile(this.storagePath, JSON.stringify(queues));
      logger.debug('memory queue saved to storage', queues);
    } else {
      logger.debug('memory queue empty, no need to save to storage');
    }
  }
  async connect() {
    if (this.connected) {
      return;
    }
    await this.loadFromStorage();
    this.connected = true;
    setImmediate(() => {
      for (const channel of this.events.keys()) {
        this.consume(channel);
      }
      // for (const channel of this.queues.keys()) {
      //   const queue = this.queues.get(channel);
      //   if (!queue?.length) {
      //     continue;
      //   }
      //   this.emitter.emit(channel, channel);
      // }
    });
  }
  async close() {
    if (!this.connected) {
      return;
    }
    const { logger } = this.options;
    this.connected = false;
    if (this.processing) {
      logger.info('memory queue waiting for processing job...');
      await this.processing;
      logger.info('memory queue job cleaned');
    }
    logger.info('memory queue gracefully shutting down...');
    await this.saveToStorage();
  }
  subscribe(channel, options) {
    if (this.events.has(channel)) {
      return;
    }
    this.events.set(channel, options);
    if (!this.queues.has(channel)) {
      this.queues.set(channel, []);
    }
    this.emitter.on(channel, this.listen);
    if (this.connected) {
      this.consume(channel);
    }
  }
  unsubscribe(channel) {
    if (!this.events.has(channel)) {
      return;
    }
    this.events.delete(channel);
    this.emitter.off(channel, this.listen);
  }
  publish(channel, content, options = { timestamp: Date.now() }) {
    const event = this.events.get(channel);
    if (!event) {
      console.debug(`memory queue (${channel}) not subscribed, skip`);
      return;
    }
    if (!this.queues.get(channel)) {
      this.queues.set(channel, []);
    }
    const queue = this.queues.get(channel);
    const message = { id: randomUUID(), content, options };
    queue.push(message);
    const { logger } = this.options;
    logger.debug(`memory queue (${channel}) published message`, content);
    setImmediate(() => {
      this.emitter.emit(channel, channel);
    });
  }
  async consume(channel, once = false) {
    while (this.connected && this.events.get(channel)) {
      const event = this.events.get(channel);
      const interval = event.interval || QUEUE_DEFAULT_INTERVAL;
      const queue = this.queues.get(channel);
      if (event.idle() && queue?.length) {
        this.listen(channel);
      }
      if (once) {
        break;
      }
      await sleep(interval);
    }
  }
  read(channel, n) {
    const queue = this.queues.get(channel);
    if (!queue?.length) {
      return [];
    }
    const { logger } = this.options;
    const messages = queue.slice(0, n);
    logger.debug(`memory queue (${channel}) read ${messages.length} messages`, messages);
    queue.splice(0, messages.length);
    const batch = messages.map(({ id, ...message }) => this.process(channel, { id, message }));
    return batch;
  }
  async process(channel, { id, message }) {
    const event = this.events.get(channel);
    const { content, options: { timeout = QUEUE_DEFAULT_ACK_TIMEOUT, maxRetries = 0, retried = 0 } = {} } = message;
    const { logger } = this.options;
    logger.debug(`memory queue (${channel}) processing message (${id})...`, content);
    return (async () =>
      event.process(content, {
        id,
        retried,
        signal: AbortSignal.timeout(timeout),
        queueOptions: message.options,
      }))()
      .then(() => {
        logger.debug(`memory queue (${channel}) consumed message (${id})`);
      })
      .catch((ex) => {
        if (maxRetries > 0 && retried < maxRetries) {
          const currentRetry = retried + 1;
          logger.warn(
            `memory queue (${channel}) consum message (${id}) failed, retrying (${currentRetry} / ${maxRetries})...`,
            ex,
          );
          setTimeout(() => {
            this.publish(channel, content, { timeout, maxRetries, retried: currentRetry, timestamp: Date.now() });
          }, 500);
        } else {
          logger.error(ex);
        }
      });
  }
}
export class EventQueue {
  app;
  options;
  adapter;
  events = new Map();
  get channelPrefix() {
    return this.options?.channelPrefix;
  }
  constructor(app, options = {}) {
    this.app = app;
    this.options = options;
    this.setAdapter(new MemoryEventQueueAdapter({ appName: this.app.name, logger: this.app.logger }));
    app.on('afterStart', async () => {
      await this.connect();
    });
    app.on('afterStop', async () => {
      app.logger.info('[queue] gracefully shutting down...');
      await this.close();
    });
  }
  getFullChannel(channel, shared = false) {
    if (shared) {
      return [this.channelPrefix, channel].filter(Boolean).join('.');
    }
    return [this.app.name, this.channelPrefix, channel].filter(Boolean).join('.');
  }
  setAdapter(adapter) {
    this.adapter = adapter;
  }
  isConnected() {
    if (!this.adapter) {
      return false;
    }
    return this.adapter.isConnected();
  }
  async connect() {
    if (!this.adapter) {
      throw new Error('no adapter set, cannot connect');
    }
    await this.adapter.connect();
    this.app.logger.debug(`connected to adapter, using memory? ${this.adapter instanceof MemoryEventQueueAdapter}`);
    for (const [channel, event] of this.events.entries()) {
      this.adapter.subscribe(this.getFullChannel(channel, event.shared), event);
    }
  }
  async close() {
    if (!this.adapter) {
      return;
    }
    await this.adapter.close();
    for (const [channel, event] of this.events.entries()) {
      this.adapter.unsubscribe(this.getFullChannel(channel, event.shared));
    }
  }
  subscribe(channel, options) {
    if (this.events.has(channel)) {
      this.app.logger.warn(`event queue already subscribed on channel "${channel}", new subscription will be ignored`);
      return;
    }
    this.events.set(channel, options);
    if (this.isConnected()) {
      this.adapter.subscribe(this.getFullChannel(channel, options.shared), this.events.get(channel));
    }
  }
  unsubscribe(channel) {
    if (!this.events.has(channel)) {
      return;
    }
    this.events.delete(channel);
    if (this.isConnected()) {
      this.adapter.unsubscribe(this.getFullChannel(channel, this.events.get(channel)?.shared));
    }
  }
  async publish(channel, message, options = {}) {
    if (!this.adapter) {
      throw new Error('no adapter set, cannot publish');
    }
    if (!this.isConnected()) {
      throw new Error('event queue not connected, cannot publish');
    }
    const event = this.events.get(channel);
    if (!event) {
      throw new Error(`event queue not subscribed on channel "${channel}", cannot publish`);
    }
    const c = this.getFullChannel(channel, event.shared);
    this.app.logger.debug(`event queue publishing to channel(${c})`, { message });
    await this.adapter.publish(c, message, {
      timeout: QUEUE_DEFAULT_ACK_TIMEOUT,
      ...options,
      timestamp: Date.now(),
    });
  }
}
export default EventQueue;
//# sourceMappingURL=event-queue.js.map
