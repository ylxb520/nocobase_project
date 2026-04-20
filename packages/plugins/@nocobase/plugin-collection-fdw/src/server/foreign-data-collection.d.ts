/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { Collection, CollectionContext, CollectionOptions, Model } from '@nocobase/database';
import { QueryInterfaceDropTableOptions, QueryInterfaceOptions } from 'sequelize';
import PluginCollectionFDWServer from './plugin';
export declare class ForeignDataCollection extends Collection {
  constructor(options: CollectionOptions, context: CollectionContext);
  static registerOptions(plugin: PluginCollectionFDWServer): {
    condition(options: any): any;
    onDump(): Promise<void>;
    onSync(model: typeof Model, options: any): Promise<void>;
  };
  removeFieldFromDb(name: string, options?: QueryInterfaceOptions): Promise<void>;
  removeFromDb(options?: QueryInterfaceDropTableOptions): Promise<Collection<any, any>>;
  protected bindFieldEventListener(): void;
}
