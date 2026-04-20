/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
import { Registry } from '@nocobase/utils/client';
import { Plugin } from '@nocobase/client';
type TaskOrigin = {
  Result?: React.ComponentType<any>;
  ResultButton?: React.ComponentType<any>;
  namespace?: string;
};
export declare class PluginAsyncTaskManagerClient extends Plugin {
  taskOrigins: Registry<TaskOrigin>;
  load(): Promise<void>;
}
export default PluginAsyncTaskManagerClient;
