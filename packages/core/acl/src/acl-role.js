/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { default as _, default as lodash } from 'lodash';
import minimatch from 'minimatch';
import { ACLAvailableStrategy } from './acl-available-strategy';
import { ACLResource } from './acl-resource';
/**
 * @internal
 */
export class ACLRole {
  acl;
  name;
  strategy;
  resources = new Map();
  snippets = new Set();
  _snippetCache = {
    params: null,
    result: null,
  };
  constructor(acl, name) {
    this.acl = acl;
    this.name = name;
  }
  _serializeSet(set) {
    return JSON.stringify([...set].sort());
  }
  getResource(name) {
    return this.resources.get(name);
  }
  setStrategy(value) {
    this.strategy = value;
  }
  getStrategy() {
    if (!this.strategy) {
      return null;
    }
    return lodash.isString(this.strategy)
      ? this.acl.availableStrategy.get(this.strategy)
      : new ACLAvailableStrategy(this.acl, this.strategy);
  }
  getResourceActionsParams(resourceName) {
    const resource = this.getResource(resourceName);
    return resource.getActions();
  }
  revokeResource(resourceName) {
    for (const key of [...this.resources.keys()]) {
      if (key === resourceName || key.includes(`${resourceName}.`)) {
        this.resources.delete(key);
      }
    }
  }
  grantAction(path, options) {
    let { resource } = this.getResourceActionFromPath(path);
    const { resourceName, actionName } = this.getResourceActionFromPath(path);
    if (!resource) {
      resource = new ACLResource({
        role: this,
        name: resourceName,
      });
      this.resources.set(resourceName, resource);
    }
    resource.setAction(actionName, options);
  }
  getActionParams(path) {
    const { action } = this.getResourceActionFromPath(path);
    return action;
  }
  revokeAction(path) {
    const { resource, actionName } = this.getResourceActionFromPath(path);
    resource.removeAction(actionName);
  }
  effectiveSnippets() {
    const currentParams = this._serializeSet(this.snippets);
    if (this._snippetCache.params === currentParams) {
      return this._snippetCache.result;
    }
    const allowedSnippets = new Set();
    const rejectedSnippets = new Set();
    const availableSnippets = this.acl.snippetManager.snippets;
    for (let snippetRule of this.snippets) {
      const negated = snippetRule.startsWith('!');
      snippetRule = negated ? snippetRule.slice(1) : snippetRule;
      for (const [_, availableSnippet] of availableSnippets) {
        if (minimatch(availableSnippet.name, snippetRule)) {
          if (negated) {
            rejectedSnippets.add(availableSnippet.name);
          } else {
            allowedSnippets.add(availableSnippet.name);
          }
        }
      }
    }
    // get difference of allowed and rejected snippets
    const effectiveSnippets = new Set([...allowedSnippets].filter((x) => !rejectedSnippets.has(x)));
    this._snippetCache = {
      params: currentParams,
      result: {
        allowed: [...effectiveSnippets],
        rejected: [...rejectedSnippets],
      },
    };
    return this._snippetCache.result;
  }
  snippetAllowed(actionPath) {
    const effectiveSnippets = this.effectiveSnippets();
    const getActions = (snippets) => {
      return snippets.map((snippetName) => this.acl.snippetManager.snippets.get(snippetName).actions).flat();
    };
    const allowedActions = getActions(effectiveSnippets.allowed);
    const rejectedActions = getActions(effectiveSnippets.rejected);
    const actionMatched = (actionPath, actionRule) => {
      return minimatch(actionPath, actionRule);
    };
    for (const action of allowedActions) {
      if (actionMatched(actionPath, action)) {
        return true;
      }
    }
    for (const action of rejectedActions) {
      if (actionMatched(actionPath, action)) {
        return false;
      }
    }
    return null;
  }
  toJSON() {
    const actions = {};
    for (const resourceName of this.resources.keys()) {
      const resourceActions = this.getResourceActionsParams(resourceName);
      for (const actionName of Object.keys(resourceActions)) {
        actions[`${resourceName}:${actionName}`] = resourceActions[actionName];
      }
    }
    return _.cloneDeep({
      role: this.name,
      strategy: this.strategy,
      actions,
      snippets: Array.from(this.snippets),
    });
  }
  getResourceActionFromPath(path) {
    const [resourceName, actionName] = path.split(':');
    const resource = this.resources.get(resourceName);
    let action = null;
    if (resource) {
      action = resource.getAction(actionName);
    }
    return {
      resourceName,
      actionName,
      resource,
      action,
    };
  }
}
//# sourceMappingURL=acl-role.js.map
