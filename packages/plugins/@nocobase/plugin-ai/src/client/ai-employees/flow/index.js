/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MultiRecordResource } from '@nocobase/flow-engine';
import _ from 'lodash';
export class FlowUtils {
  static getSubModels(model) {
    return Object.values(model.subModels).flatMap((x) => (_.isArray(x) ? x : [x]));
  }
  static walkthrough(model, callback) {
    const queue = FlowUtils.getSubModels(model);
    while (queue.length) {
      const item = queue.shift();
      if (item.subModels) {
        queue.push(...FlowUtils.getSubModels(item));
      }
      callback(item);
    }
  }
  static getCollection(model) {
    if (!model) {
      return {};
    }
    const fields = model.collection.getFields().map((field) => ({
      readonly: field.readonly,
      name: field.name,
      type: field.type,
      dataType: field.dataType,
      title: field.title,
      enum: field.enum,
      defaultValue: field.defaultValue,
    }));
    return {
      dataSource: model.dataSource.key,
      name: model.collection.name,
      title: model.collection.title,
      fields,
    };
  }
  static async getResource(model) {
    if (!model) {
      return null;
    }
    if (!model.resource) {
      return null;
    }
    if (model.resource instanceof MultiRecordResource) {
      const { data } = await model.resource.runAction('list', {
        method: 'get',
        params: {
          page: 1,
          pageSize: 2000,
        },
      });
      return data;
    } else {
      return model.resource.getData();
    }
  }
}
//# sourceMappingURL=index.js.map
