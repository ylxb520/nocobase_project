/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const NAMESPACE = '@nocobase/plugin-async-task-manager';
export declare const TASK_STATUS: {
  readonly PENDING: any;
  readonly RUNNING: 0;
  readonly SUCCEEDED: 1;
  readonly FAILED: -1;
  readonly CANCELED: -2;
};
export declare const TASK_STATUS_OPTIONS: {
  readonly [x: number]:
    | {
        readonly value: any;
        readonly label: "{{t('Waiting', { ns: '@nocobase/plugin-async-task-manager' })}}";
        readonly color: 'default';
        readonly icon: 'ClockCircleOutlined';
      }
    | {
        readonly value: 0;
        readonly label: "{{t('Processing', { ns: '@nocobase/plugin-async-task-manager' })}}";
        readonly color: 'processing';
        readonly icon: 'LoadingOutlined';
      }
    | {
        readonly value: 1;
        readonly label: "{{t('Completed', { ns: '@nocobase/plugin-async-task-manager' })}}";
        readonly color: 'success';
        readonly icon: 'CheckCircleOutlined';
      }
    | {
        readonly value: -1;
        readonly label: "{{t('Failed', { ns: '@nocobase/plugin-async-task-manager' })}}";
        readonly color: 'error';
        readonly icon: 'CloseCircleOutlined';
      }
    | {
        readonly value: -2;
        readonly label: "{{t('Cancelled', { ns: '@nocobase/plugin-async-task-manager' })}}";
        readonly color: 'warning';
        readonly icon: 'StopOutlined';
      };
  readonly 0: {
    readonly value: 0;
    readonly label: "{{t('Processing', { ns: '@nocobase/plugin-async-task-manager' })}}";
    readonly color: 'processing';
    readonly icon: 'LoadingOutlined';
  };
  readonly 1: {
    readonly value: 1;
    readonly label: "{{t('Completed', { ns: '@nocobase/plugin-async-task-manager' })}}";
    readonly color: 'success';
    readonly icon: 'CheckCircleOutlined';
  };
  readonly [-1]: {
    readonly value: -1;
    readonly label: "{{t('Failed', { ns: '@nocobase/plugin-async-task-manager' })}}";
    readonly color: 'error';
    readonly icon: 'CloseCircleOutlined';
  };
  readonly [-2]: {
    readonly value: -2;
    readonly label: "{{t('Cancelled', { ns: '@nocobase/plugin-async-task-manager' })}}";
    readonly color: 'warning';
    readonly icon: 'StopOutlined';
  };
};
export declare const TASK_RESULT_TYPE: {
  readonly NONE: 'none';
  readonly FILE: 'file';
  readonly DATA: 'data';
};
