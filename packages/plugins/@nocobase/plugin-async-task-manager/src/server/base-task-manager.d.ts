/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Application } from '@nocobase/server';
import { Logger } from '@nocobase/logger';
import { AsyncTasksManager, CreateTaskOptions } from './interfaces/async-task-manager';
import { ITask, TaskConstructor, TaskModel } from './interfaces/task';
import { TaskId, TaskStatus } from '../common/types';
import { ConcurrencyMode, ConcurrencyMonitor } from './interfaces/concurrency-monitor';
export declare class BaseTaskManager implements AsyncTasksManager {
  private taskTypes;
  private tasks;
  private readonly cleanupDelay;
  private cleanupTimer;
  private logger;
  private app;
  private progressThrottles;
  private concurrencyMonitor;
  get concurrency(): number;
  set concurrency(concurrency: number);
  private idle;
  private onQueueTask;
  private onTaskProgress;
  private onTaskAfterCreate;
  private onTaskStatusChanged;
  private onTaskAfterDelete;
  private onTaskCancelSignal;
  private cleanup;
  private getThrottledProgressEmitter;
  setLogger(logger: Logger): void;
  setApp(app: Application): void;
  private enqueueTask;
  cancelTask(taskId: TaskId, externally?: boolean): Promise<void>;
  createTask(data: TaskModel, { useQueue, ...options }?: CreateTaskOptions): Promise<ITask>;
  getTask(taskId: TaskId): ITask | undefined;
  getTaskStatus(taskId: TaskId): Promise<TaskStatus>;
  registerTaskType(taskType: TaskConstructor): void;
  private prepareTask;
  runTask(task: ITask): Promise<void>;
}
export declare class ConcurrencyMonitorDelegate implements ConcurrencyMonitor {
  private mode;
  private appConcurrencyMonitor;
  private processConcurrencyMonitor;
  constructor(
    mode?: ConcurrencyMode,
    appConcurrencyMonitor?: ConcurrencyMonitor,
    processConcurrencyMonitor?: ConcurrencyMonitor,
  );
  private get concurrencyMonitor();
  idle(): boolean;
  get concurrency(): number;
  set concurrency(concurrency: number);
  increase(taskId: TaskId): boolean;
  decrease(taskId: TaskId): void;
}
