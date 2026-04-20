/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Metric } from './metric';
import { Trace } from './trace';
export class Telemetry {
  serviceName;
  appName;
  version;
  instrumentations = [];
  trace;
  metric;
  started = false;
  constructor(options) {
    const { trace, metric, serviceName, appName, version } = options || {};
    this.trace = new Trace({ tracerName: `${serviceName}-trace`, version, ...trace });
    this.metric = new Metric({ meterName: `${serviceName}-meter`, version, ...metric });
    this.serviceName = serviceName || 'nocobase';
    this.appName = appName;
    this.version = version || '';
  }
  init() {
    registerInstrumentations({
      instrumentations: this.instrumentations,
    });
    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: this.serviceName,
      [ATTR_SERVICE_VERSION]: this.version,
      'app.name': this.appName,
    });
    this.trace.init(resource);
    this.metric.init(resource);
  }
  start() {
    if (!this.started) {
      this.trace.start();
      this.metric.start();
    }
    this.started = true;
  }
  async shutdown() {
    await Promise.all([this.trace.shutdown(), this.metric.shutdown()]);
    this.started = false;
  }
  addInstrumentation(...instrumentation) {
    this.instrumentations.push(...instrumentation);
  }
}
//# sourceMappingURL=telemetry.js.map
