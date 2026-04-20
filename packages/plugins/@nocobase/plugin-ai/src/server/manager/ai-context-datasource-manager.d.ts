/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { QueryObject } from '@nocobase/utils';
import { AIContextDatasource } from '../../collections/ai-context-datasource';
import PluginAIServer from '../plugin';
import { WorkContextResolveStrategy } from '../types';
import { Context } from '@nocobase/actions';
export declare class AIContextDatasourceManager {
  protected plugin: PluginAIServer;
  constructor(plugin: PluginAIServer);
  preview(ctx: Context, options: PreviewOptions): Promise<QueryResult | null>;
  query(ctx: Context, options: InnerQueryOptions): Promise<QueryResult | null>;
  provideWorkContextResolveStrategy(): WorkContextResolveStrategy;
  private innerQuery;
}
export type PreviewOptions = Pick<
  AIContextDatasource,
  'datasource' | 'collectionName' | 'fields' | 'appends' | 'filter' | 'sort' | 'limit'
> & {
  offset?: number;
};
export type QueryOptions = {
  id: string;
};
export type QueryResult = {
  options: InnerQueryOptions;
  total: number;
  records: {
    name: string;
    type: string;
    value: unknown;
  }[][];
};
type InnerQueryOptions = Omit<PreviewOptions, 'filter'> & {
  filter: QueryObject;
};
export {};
