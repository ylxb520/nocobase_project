/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="koa-bodyparser" />
import Database, { CollectionOptions } from '@nocobase/database';
import { Handlers, ResourceOptions, Resourcer } from '@nocobase/resourcer';
import Koa from 'koa';
import supertest, { SuperAgentTest } from 'supertest';
interface ActionParams {
  fields?: string[];
  filter?: any;
  filterByTk?: any;
  sort?: string[];
  page?: number;
  pageSize?: number;
  values?: any;
  /**
   * @deprecated
   */
  resourceName?: string;
  /**
   * @deprecated
   */
  resourceIndex?: string;
  /**
   * @deprecated
   */
  associatedName?: string;
  /**
   * @deprecated
   */
  associatedIndex?: string;
  [key: string]: any;
}
interface SortActionParams {
  resourceName?: string;
  resourceIndex?: any;
  associatedName?: string;
  associatedIndex?: any;
  sourceId?: any;
  targetId?: any;
  sortField?: string;
  method?: string;
  target?: any;
  sticky?: boolean;
  [key: string]: any;
}
interface Resource {
  get: (params?: ActionParams) => Promise<supertest.Response>;
  list: (params?: ActionParams) => Promise<supertest.Response>;
  create: (params?: ActionParams) => Promise<supertest.Response>;
  update: (params?: ActionParams) => Promise<supertest.Response>;
  destroy: (params?: ActionParams) => Promise<supertest.Response>;
  sort: (params?: SortActionParams) => Promise<supertest.Response>;
  [name: string]: (params?: ActionParams) => Promise<supertest.Response>;
}
export declare class MockServer extends Koa {
  db: Database;
  resourcer: Resourcer;
  constructor();
  collection(options: CollectionOptions): import('@nocobase/database').Collection<any, any>;
  resource(options: ResourceOptions): void;
  destroy(): Promise<void>;
  actions(handlers: Handlers): void;
  agent(): SuperAgentTest & {
    resource: (name: string, resourceOf?: any) => Resource;
  };
}
export declare function mockServer(): MockServer;
export {};
