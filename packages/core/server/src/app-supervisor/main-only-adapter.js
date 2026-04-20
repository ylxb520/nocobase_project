/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/** Minimal single-process adapter only for booting the main application. */
export class MainOnlyAdapter {
  supervisor;
  name;
  app;
  status;
  appErrors = {};
  constructor(supervisor) {
    this.supervisor = supervisor;
    this.name = 'main-only';
  }
  async getApp(appName, options = {}) {
    if (appName !== 'main') {
      this.supervisor.logger.warn(`only main app is supported`, { method: 'getApp', appName });
      return;
    }
    if (!options.withOutBootStrap) {
      await this.bootstrapApp(appName);
    }
    return this.app;
  }
  async bootstrapApp(appName) {
    if (appName !== 'main' || !this.app) {
      this.setAppStatus(appName, 'not_found');
      return;
    }
    const status = this.getAppStatus('main');
    if (this.hasApp(appName) && status && status !== 'preparing') {
      return;
    }
    this.setAppStatus('main', 'initializing');
    this.setAppStatus('main', 'initialized');
  }
  addApp(app) {
    if (app.name !== 'main') {
      this.supervisor.logger.warn(`only main app is supported`, { method: 'addApp' });
      return;
    }
    if (this.app) {
      throw new Error(`app ${app.name} already exists`);
    }
    this.app = app;
    if (!this.status || this.status === 'not_found') {
      this.setAppStatus(app.name, 'preparing');
    }
    return app;
  }
  getApps() {
    return [this.app];
  }
  hasApp(appName) {
    if (appName !== 'main') {
      return false;
    }
    return !!this.app;
  }
  async startApp(appName) {
    if (appName !== 'main') {
      this.supervisor.logger.warn(`only main app is supported`, { method: 'startApp' });
      return;
    }
    const app = await this.getApp(appName, { withOutBootStrap: true });
    await app?.runCommand('start', '--quickstart');
  }
  async stopApp(appName) {
    if (appName !== 'main') {
      this.supervisor.logger.warn(`only main app is supported`, { method: 'stopApp' });
      return;
    }
    await this.app.runCommand('stop');
  }
  async removeApp(appName) {
    if (appName !== 'main') {
      this.supervisor.logger.warn(`only main app is supported`, { method: 'removeApp' });
      return;
    }
    if (!this.app) {
      return;
    }
    await this.app.runCommand('destroy');
  }
  async upgradeApp(appName) {
    if (appName !== 'main') {
      this.supervisor.logger.warn(`only main app is supported`, { method: 'upgrade' });
      return;
    }
    if (!this.app) {
      return;
    }
    await this.app.runCommand('upgrade');
  }
  async removeAllApps() {
    return this.removeApp('main');
  }
  setAppStatus(appName, status, options = {}) {
    if (this.status === status) {
      return;
    }
    this.status = status;
    this.supervisor.emit('appStatusChanged', { appName, status, options });
  }
  getAppStatus(appName, defaultStatus) {
    return this.status ?? defaultStatus ?? null;
  }
  hasAppError(appName) {
    return !!this.appErrors[appName];
  }
  setAppError(appName, error) {
    this.appErrors[appName] = error;
    this.supervisor.emit('appError', { appName, error });
  }
  clearAppError(appName) {
    this.appErrors[appName] = null;
  }
  setAppLastSeenAt() {}
  getAppLastSeenAt(appName) {
    return null;
  }
}
//# sourceMappingURL=main-only-adapter.js.map
