/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
export class Trace {
  processorName;
  processors = new Registry();
  tracerName;
  version;
  provider;
  resource;
  activeProcessors = [];
  constructor(options) {
    const { processorName, tracerName, version } = options || {};
    this.processorName = processorName || 'console';
    this.tracerName = tracerName || 'nocobase-trace';
    this.version = version || '';
    this.registerProcessor('console', () => new BatchSpanProcessor(new ConsoleSpanExporter()));
  }
  init(resource) {
    this.resource = resource;
  }
  registerProcessor(name, processor) {
    this.processors.register(name, processor);
  }
  getProcessor(name) {
    return this.processors.get(name);
  }
  start() {
    if (!this.resource) {
      throw new Error('Trace.init(resource) must be called before start()');
    }
    let names = this.processorName;
    if (typeof names === 'string') {
      names = names.split(',');
    }
    const processors = [];
    for (const name of names) {
      const processor = this.getProcessor(name);
      if (!processor) {
        continue;
      }
      processors.push(processor());
    }
    this.activeProcessors = processors;
    const config = {
      resource: this.resource,
      spanProcessors: processors,
    };
    this.provider = new NodeTracerProvider(config);
    this.provider.register();
  }
  getTracer(name, version) {
    if (!this.provider) {
      return null;
    }
    return this.provider.getTracer(name || this.tracerName, version || this.version);
  }
  async shutdown() {
    await Promise.all(this.activeProcessors.map((p) => p.shutdown()));
    await this.provider?.shutdown();
  }
}
//# sourceMappingURL=trace.js.map
