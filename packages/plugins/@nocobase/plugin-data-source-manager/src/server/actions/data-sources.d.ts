/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Context, Next } from '@nocobase/actions';
declare const _default: {
  'dataSources:listEnabled'(ctx: Context, next: Next): Promise<void>;
  'dataSources:testConnection'(ctx: Context, next: Next): Promise<void>;
  'dataSources:refresh'(ctx: Context, next: Next): Promise<void>;
  'dataSources:readTables'(ctx: Context, next: Next): Promise<void>;
  'dataSources:loadTables'(ctx: Context, next: Next): Promise<void>;
};
export default _default;
