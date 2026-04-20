/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionModel } from '@nocobase/client';
import type { ButtonProps } from 'antd/es/button';
export declare class ImportActionModel extends ActionModel {
  static scene: import('@nocobase/client').ActionSceneType;
  defaultProps: ButtonProps;
  getAclActionName(): string;
}
