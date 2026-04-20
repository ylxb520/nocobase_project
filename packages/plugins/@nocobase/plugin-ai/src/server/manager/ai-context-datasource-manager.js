/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { assign, transformFilter } from '@nocobase/utils';
import { checkFilterParams, parseJsonTemplate } from '@nocobase/acl';
export class AIContextDatasourceManager {
  plugin;
  constructor(plugin) {
    this.plugin = plugin;
  }
  async preview(ctx, options) {
    return await this.innerQuery(ctx, { ...options, filter: options.filter ? transformFilter(options.filter) : null });
  }
  async query(ctx, options) {
    return await this.innerQuery(ctx, { ...options, filter: options.filter });
  }
  provideWorkContextResolveStrategy() {
    return async (ctx, contextItem) => {
      if (!contextItem.content) {
        return '';
      }
      const query = contextItem.content;
      const queryResult = await this.innerQuery(ctx, query);
      return JSON.stringify(queryResult);
    };
  }
  async innerQuery(ctx, options) {
    const { datasource, collectionName } = options;
    const resource = collectionName;
    const action = 'list';
    const ds = this.plugin.app.dataSourceManager.get(datasource);
    if (!ds) {
      this.plugin.log.warn(`Datasource ${datasource} not found`);
      return {
        options,
        total: 0,
        records: [],
      };
    }
    const collection = ds.collectionManager.getCollection(collectionName);
    if (!collection) {
      this.plugin.log.warn(`Collection ${collectionName} not found`);
      return {
        options,
        total: 0,
        records: [],
      };
    }
    if (!options?.fields?.length) {
      options.fields = collection
        .getFields()
        .filter((x) => !x.isRelationField())
        .map((x) => x.options.name);
    }
    const skip = await ds.acl.allowManager.isAllowed(resource, action, ctx);
    if (!skip) {
      const roles = ctx.state.currentRoles || ['anonymous'];
      const can = ds.acl.can({ roles, resource, action, rawResourceName: resource });
      if (!can || typeof can !== 'object') {
        return {
          options,
          total: 0,
          records: [],
        };
      }
      checkFilterParams(collection, can.params?.filter);
      const parsedParams = can.params ? await parseJsonTemplate(can.params, ctx) : {};
      if (parsedParams.appends && options.fields) {
        for (const queryField of options.fields) {
          if (parsedParams.appends.indexOf(queryField) !== -1) {
            // move field to appends
            if (!options.appends) {
              options.appends = [];
            }
            options.appends.push(queryField);
            options.fields = options.fields.filter((f) => f !== queryField);
          }
        }
      }
      assign(options, parsedParams, {
        filter: 'andMerge',
        fields: 'intersect',
        // appends: 'union',
        except: 'union',
        whitelist: 'intersect',
        blacklist: 'intersect',
        // sort: 'overwrite',
        appends: (x, y) => {
          if (!x) {
            return [];
          }
          if (!y) {
            return x;
          }
          return x.filter((i) => y.includes(i.split('.').shift()));
        },
      });
    }
    const { fields, filter, sort, offset, limit } = options;
    const result = await collection.repository.find({ fields, filter, sort, offset: offset ?? 0, limit });
    const total = await collection.repository.count({ fields, filter });
    const records = result.map((x) =>
      fields.map((field) => {
        const { name, type } = collection.getField(field)?.options || {};
        const value = x[field];
        return {
          name,
          type,
          value,
        };
      }),
    );
    return {
      options,
      total: total,
      records,
    };
  }
}
//# sourceMappingURL=ai-context-datasource-manager.js.map
