/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DataSource } from './data-source';
import { DataSourceManager } from './data-source-manager';
import { DataSourceConstructor } from './types';
export declare class DataSourceFactory {
  protected dataSourceManager: DataSourceManager;
  collectionTypes: Map<string, DataSourceConstructor>;
  constructor(dataSourceManager: DataSourceManager);
  register(type: string, dataSourceClass: DataSourceConstructor): void;
  getClass<T extends DataSource = DataSource>(type: string): DataSourceConstructor<T>;
  create<T extends DataSource = DataSource>(type: string, options?: any): T;
}
