/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowEngine } from '../flowEngine';
import type { FlowModel } from '../models/flowModel';
type LifecycleType =
  | 'created'
  | 'mounted'
  | 'unmounted'
  | 'destroyed'
  | `event:${string}:start`
  | `event:${string}:end`
  | `event:${string}:error`;
type EventPredicateWhen = ((e: LifecycleEvent) => boolean) & {
  __eventType?: string;
};
export type ScheduleWhen = LifecycleType | EventPredicateWhen;
export interface ScheduleOptions {
  when?: ScheduleWhen;
}
export type ScheduledCancel = () => boolean;
export interface LifecycleEvent {
  type: LifecycleType;
  uid: string;
  model?: FlowModel;
  runId?: string;
  error?: any;
  inputArgs?: Record<string, any>;
  result?: any;
  aborted?: boolean;
  flowKey?: string;
  stepKey?: string;
}
export declare class ModelOperationScheduler {
  private engine;
  private itemsByTargetUid;
  private itemIdsByFromUid;
  private itemsById;
  private unbindHandlers;
  private subscribedEventNames;
  constructor(engine: FlowEngine);
  /** 外部调用入口 */
  schedule(
    fromModelOrUid: FlowModel | string,
    toUid: string,
    fn: (model: FlowModel) => Promise<void> | void,
    options?: ScheduleOptions,
  ): ScheduledCancel;
  cancel(filter: { fromUid?: string; toUid?: string }): void;
  /** 引擎关闭时释放 */
  dispose(): void;
  private bindEngineLifecycle;
  private ensureEventSubscriptionIfNeeded;
  private parseEventWhen;
  private processLifecycleEvent;
  private shouldTrigger;
  private tryExecuteOnce;
  private internalCancel;
  private takeItem;
}
export default ModelOperationScheduler;
