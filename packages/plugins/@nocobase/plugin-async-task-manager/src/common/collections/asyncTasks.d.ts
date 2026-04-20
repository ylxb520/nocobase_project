/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
declare const _default: {
  name: string;
  autoGenId: boolean;
  dumpRules: string;
  migrationRules: string[];
  createdAt: boolean;
  updatedAt: boolean;
  createdBy: boolean;
  fields: (
    | {
        type: string;
        name: string;
        primaryKey: boolean;
      }
    | {
        type: string;
        name: string;
        primaryKey?: undefined;
      }
  )[];
};
export default _default;
