/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Index as BaseIndex, ExportHandler, IndexOptions } from 'flexsearch';
export declare class Index {
  private index;
  private ids;
  constructor(options?: IndexOptions);
  add(id: string | number, text: string): Promise<BaseIndex<false, false, true>>;
  remove(id: string | number): Promise<void>;
  search(query: string, options?: any): Promise<(string | number)[]>;
  export(handler: ExportHandler): void;
  import(key: string, data: string): void;
}
