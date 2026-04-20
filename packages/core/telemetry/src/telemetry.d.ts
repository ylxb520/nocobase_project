/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Instrumentation } from '@opentelemetry/instrumentation';
import { Metric, MetricOptions } from './metric';
import { Trace, TraceOptions } from './trace';
export interface TelemetryOptions {
  serviceName?: string;
  appName?: string;
  version?: string;
  trace?: TraceOptions;
  metric?: MetricOptions;
}
export declare class Telemetry {
  serviceName: string;
  appName: string;
  version: string;
  instrumentations: Instrumentation[];
  trace: Trace;
  metric: Metric;
  started: boolean;
  constructor(options?: TelemetryOptions);
  init(): void;
  start(): void;
  shutdown(): Promise<void>;
  addInstrumentation(...instrumentation: Instrumentation[]): void;
}
