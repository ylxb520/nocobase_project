/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="node" />
import { Worker } from 'worker_threads';
import { TaskType } from './task-type';
export declare function parseArgv(list: string[]): any;
export declare class CommandTaskType extends TaskType {
  static type: string;
  workerThread: Worker;
  static defaults(data: any): any;
  execute(): Promise<unknown>;
}
