/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { mockDatabase } from '@nocobase/database';
import { Resourcer } from '@nocobase/resourcer';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import qs from 'qs';
import supertest from 'supertest';
import db2resource from './db2resource';
export class MockServer extends Koa {
  db;
  resourcer;
  constructor() {
    super();
    this.db = mockDatabase({
      sync: {
        force: true,
      },
    });
    this.resourcer = new Resourcer({
      prefix: '/api',
    });
    this.use(async (ctx, next) => {
      ctx.db = this.db;
      ctx.resourcer = this.resourcer;
      await next();
    });
    this.use(bodyParser());
    this.use(db2resource);
    this.use(
      this.resourcer.restApiMiddleware({
        prefix: '/api',
      }),
    );
  }
  collection(options) {
    return this.db.collection(options);
  }
  resource(options) {
    this.resourcer.define(options);
  }
  async destroy() {
    return this.db.close();
  }
  actions(handlers) {
    this.resourcer.registerActionHandlers(handlers);
  }
  agent() {
    const agent = supertest.agent(this.callback());
    const prefix = this.resourcer.options.prefix;
    const proxy = new Proxy(agent, {
      get(target, method, receiver) {
        if (method === 'resource') {
          return (name, resourceOf) => {
            const keys = name.split('.');
            const proxy = new Proxy(
              {},
              {
                get(target, method, receiver) {
                  return (params = {}) => {
                    let { filterByTk } = params;
                    const { values = {}, file, ...restParams } = params;
                    if (params.associatedIndex) {
                      resourceOf = params.associatedIndex;
                    }
                    if (params.resourceIndex) {
                      filterByTk = params.resourceIndex;
                    }
                    let url = prefix;
                    if (keys.length > 1) {
                      url += `/${keys[0]}/${resourceOf}/${keys[1]}`;
                    } else {
                      url += `/${name}`;
                    }
                    url += `:${method}`;
                    if (filterByTk) {
                      url += `/${filterByTk}`;
                    }
                    switch (method) {
                      case 'upload':
                        return agent
                          .post(`${url}?${qs.stringify(restParams)}`)
                          .attach('file', file)
                          .field(values);
                      case 'list':
                      case 'get':
                        return agent.get(`${url}?${qs.stringify(restParams)}`);
                      default:
                        return agent.post(`${url}?${qs.stringify(restParams)}`).send(values);
                    }
                  };
                },
              },
            );
            return proxy;
          };
        }
        return (...args) => {
          return agent[method](...args);
        };
      },
    });
    return proxy;
  }
}
export function mockServer() {
  return new MockServer();
}
//# sourceMappingURL=index.js.map
