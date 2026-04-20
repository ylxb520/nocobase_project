/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Logger } from '@nocobase/logger';
import { ITask, TaskModel } from './interfaces/task';
import Application from '@nocobase/server';
export declare class TaskType implements ITask {
  record: TaskModel;
  static type: string;
  static cancelable: boolean;
  static defaults(data: any): any;
  protected logger: Logger;
  protected app: Application;
  protected abortController: AbortController;
  onProgress: (record: TaskModel) => void;
  get isCanceled(): boolean;
  constructor(record: TaskModel);
  setLogger(logger: Logger): void;
  setApp(app: Application): void;
  /**
   * Cancel the task
   */
  cancel(): Promise<this>;
  /**
   * Execute the task implementation
   * @returns Promise that resolves with the task result
   */
  execute(): Promise<any>;
  /**
   * Report task progress
   * @param progress Progress information containing total and current values
   */
  reportProgress(progress: { total: number; current: number }): void;
  /**
   * Run the task
   * This method handles task lifecycle, including:
   * - Status management
   * - Error handling
   * - Progress tracking
   * - Event emission
   */
  run(): Promise<void>;
  toJSON(): any;
}
