/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import _ from 'lodash';
import Action from './action';
import Middleware from './middleware';
export class Resource {
  resourcer;
  middlewares;
  actions = new Map();
  options;
  except;
  constructor(options, resourcer) {
    const { middleware, middlewares, actions = {}, only = [], except = [] } = options;
    this.options = options;
    this.resourcer = resourcer;
    this.middlewares = Middleware.toInstanceArray(middleware || middlewares);
    let excludes = [];
    for (const [name, handler] of resourcer.getRegisteredHandlers()) {
      if (!actions[name]) {
        actions[name] = handler;
      }
    }
    if (except.length > 0) {
      excludes = except;
    } else if (only.length > 0) {
      excludes = Object.keys(actions).filter((name) => !only.includes(name));
    }
    this.except = excludes;
    this.actions = Action.toInstanceMap(_.omit(actions, excludes), this);
  }
  getName() {
    return this.options.name;
  }
  getExcept() {
    return this.except;
  }
  addAction(name, handler) {
    if (this.except.includes(name)) {
      throw new Error(`${name} action is not allowed`);
    }
    if (this.actions.has(name)) {
      throw new Error(`${name} action already exists`);
    }
    const action = new Action(handler);
    action.setName(name);
    action.setResource(this);
    action.middlewares.unshift(...this.middlewares);
    this.actions.set(name, action);
  }
  getAction(action) {
    if (this.except.includes(action)) {
      throw new Error(`${action} action is not allowed`);
    }
    if (!this.actions.has(action)) {
      throw new Error(`${action} action does not exist`);
    }
    return this.actions.get(action);
  }
}
export default Resource;
//# sourceMappingURL=resource.js.map
