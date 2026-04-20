/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare class IdMapper {
  private nextId;
  private ext2num;
  private num2ext;
  toNumeric(id: string | number): number;
  getNumeric(id: string | number): number | undefined;
  toExternal(id: number): string | number;
  remove(id: string | number): void;
}
