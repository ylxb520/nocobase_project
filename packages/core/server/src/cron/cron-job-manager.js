/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CronJob } from 'cron';
export class CronJobManager {
  app;
  _jobs = new Set();
  _started = false;
  constructor(app) {
    this.app = app;
    app.on('beforeStop', async () => {
      this.stop();
    });
    app.on('afterStart', async () => {
      this.start();
    });
    app.on('beforeReload', async () => {
      this.stop();
    });
  }
  get started() {
    return this._started;
  }
  get jobs() {
    return this._jobs;
  }
  addJob(options) {
    const cronJob = new CronJob(options);
    this._jobs.add(cronJob);
    return cronJob;
  }
  removeJob(job) {
    job.stop();
    this._jobs.delete(job);
  }
  start() {
    this._jobs.forEach((job) => {
      job.start();
    });
    this._started = true;
  }
  stop() {
    this._jobs.forEach((job) => {
      job.stop();
    });
    this._started = false;
  }
}
//# sourceMappingURL=cron-job-manager.js.map
