/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionModel } from '@nocobase/client';
import { FlowModelContext } from '@nocobase/flow-engine';
import { AIEmployeeShortcutModel } from './AIEmployeeShortcutModel';
export declare class AIEmployeeButtonModel extends AIEmployeeShortcutModel {
  constructor(options: any);
}
export declare class AIEmployeeActionModel extends ActionModel {
  static scene: import('@nocobase/client').ActionSceneType;
  static defineChildren(ctx: FlowModelContext): Promise<any>;
}
