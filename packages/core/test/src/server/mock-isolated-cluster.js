/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import Path from 'node:path';
import { spawn } from 'node:child_process';
import { getPortPromise } from 'portfinder';
import { uid } from '@nocobase/utils';
import { createMockServer } from './mock-server';
export class MockIsolatedCluster {
  options;
  script = `${process.env.APP_PACKAGE_ROOT}/src/index.ts`;
  processes = [];
  mockApp;
  constructor(options = {}) {
    this.options = options;
    if (options.script) {
      this.script = options.script;
    }
  }
  async start() {
    // NOTE: use this for install app first
    this.mockApp = await createMockServer({
      plugins: this.options.plugins,
    });
    this.processes = [];
    const ports = [];
    for (let i = 0; i < (this.options.instances ?? 2); i++) {
      const port = await getPortPromise();
      const childProcess = spawn('node', ['./node_modules/tsx/dist/cli.mjs', this.script, 'start'], {
        env: {
          ...process.env,
          ...this.options.env,
          APP_PORT: `${port}`,
          APPEND_PRESET_BUILT_IN_PLUGINS: (this.options.plugins ?? []).join(','),
          SOCKET_PATH: `storage/tests/gateway-cluster-${uid()}.sock`,
          PM2_HOME: Path.resolve(process.cwd(), `storage/tests/.pm2-${uid()}`),
        },
      });
      await new Promise((resolve, reject) => {
        const startTimer = setTimeout(() => reject(new Error('app not started in 10s')), 10000);
        childProcess.stdout.on('data', (data) => {
          console.log(data.toString());
          if (data.toString().includes('app has been started')) {
            clearTimeout(startTimer);
            resolve(childProcess);
          }
        });
      });
      this.processes.push({
        childProcess,
        port,
      });
      ports.push(port);
    }
    return ports;
  }
  async stop() {
    await this.mockApp.destroy();
    return Promise.all(
      this.processes.map(({ childProcess }) => {
        const promise = new Promise((resolve) => {
          childProcess.on('exit', resolve);
        });
        childProcess.kill();
        return promise;
      }),
    );
  }
}
//# sourceMappingURL=mock-isolated-cluster.js.map
