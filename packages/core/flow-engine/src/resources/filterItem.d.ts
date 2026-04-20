/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
type FilterOptions = {
  path: string;
  value: any;
  operator?: string;
};
export declare class FilterItem {
  protected options: FilterOptions;
  constructor(options: FilterOptions);
  toJSON(): {
    [x: string]: any;
  };
}
export type FilterGroupOptions = {
  logic: '$and' | '$or';
  items: Array<FilterItem | FilterOptions | FilterGroup | FilterGroupOptions>;
};
export declare class FilterGroup {
  protected options: {
    logic: '$and' | '$or';
    items: Array<FilterItem | FilterGroup>;
  };
  constructor(options: FilterGroupOptions);
  toJSON(): any;
}
export {};
