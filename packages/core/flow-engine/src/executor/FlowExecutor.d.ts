/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowEngine } from '../flowEngine';
import type { FlowModel } from '../models';
import type { DispatchEventOptions } from '../types';
export declare class FlowExecutor {
  private readonly engine;
  constructor(engine: FlowEngine);
  private emitModelEventIf;
  /** Cache wrapper for applyFlow cache lifecycle */
  private withApplyFlowCache;
  /**
   * Execute a single flow on model.
   */
  runFlow(
    model: FlowModel,
    flowKey: string,
    inputArgs?: Record<string, any>,
    runId?: string,
    eventName?: string,
  ): Promise<any>;
  /**
   * Dispatch an event to flows bound via flow.on and execute them.
   */
  dispatchEvent(
    model: FlowModel,
    eventName: string,
    inputArgs?: Record<string, any>,
    options?: DispatchEventOptions,
  ): Promise<any>;
}
