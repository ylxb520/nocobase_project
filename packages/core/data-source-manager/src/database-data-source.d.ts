/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Database } from '@nocobase/database';
import { DatabaseIntrospector } from './database-introspector/database-introspector';
import { DataSource } from './data-source';
import { Context } from '@nocobase/actions';
import { CollectionOptions, FieldOptions } from './types';
export declare abstract class DatabaseDataSource<
  T extends DatabaseIntrospector = DatabaseIntrospector,
> extends DataSource {
  introspector: T;
  createDatabaseIntrospector(db: Database): T;
  abstract readTables(): Promise<any>;
  abstract loadTables(ctx: Context, tables: string[]): Promise<any>;
  mergeWithLoadedCollections(
    collections: CollectionOptions[],
    loadedCollections: {
      [name: string]: {
        name: string;
        fields: FieldOptions[];
      };
    },
  ): CollectionOptions[];
  private mergeFieldOptions;
}
