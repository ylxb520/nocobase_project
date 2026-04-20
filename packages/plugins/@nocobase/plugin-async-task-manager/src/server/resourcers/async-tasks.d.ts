/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Context } from '@nocobase/actions';
declare const _default: {
  name: string;
  actions: {
    list(ctx: any, next: any): Promise<void>;
    get(ctx: any, next: any): Promise<void>;
    stop(ctx: Context, next: any): Promise<never>;
    fetchFile(ctx: any, next: any): Promise<any>;
  };
};
export default _default;
