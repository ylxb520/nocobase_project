/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
declare const _default: {
  name: string;
  actions: {
    list(ctx: any, next: any): Promise<void>;
    get(ctx: any, next: any): Promise<void>;
    query(ctx: any, next: any): Promise<void>;
  };
};
export default _default;
