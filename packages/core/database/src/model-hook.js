/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
const { hooks } = require('sequelize/lib/hooks');
export class ModelHook {
  database;
  boundEvents = new Set();
  constructor(database) {
    this.database = database;
  }
  match(event) {
    // NOTE: skip Symbol event
    if (!lodash.isString(event)) {
      return null;
    }
    const type = event.split('.').pop();
    return type in hooks ? type : null;
  }
  findModelName(hookArgs) {
    for (let arg of hookArgs) {
      if (Array.isArray(arg)) {
        arg = arg[0];
      }
      if (arg?._previousDataValues) {
        return arg.constructor.name;
      }
      if (lodash.isPlainObject(arg)) {
        if (arg['model']) {
          return arg['model'].name;
        }
        const modelName = arg['modelName'];
        if (this.database.sequelize.isDefined(modelName)) {
          return modelName;
        }
      }
    }
    return null;
  }
  bindEvent(type) {
    this.boundEvents.add(type);
  }
  hasBoundEvent(type) {
    return this.boundEvents.has(type);
  }
  buildSequelizeHook(type) {
    return async (...args) => {
      const modelName = this.findModelName(args);
      if (modelName) {
        // emit model event
        await this.database.emitAsync(`${modelName}.${type}`, ...args);
      }
      // emit sequelize global event
      await this.database.emitAsync(type, ...args);
    };
  }
}
//# sourceMappingURL=model-hook.js.map
