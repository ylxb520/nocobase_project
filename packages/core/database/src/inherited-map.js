/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
class TableNode {
  name;
  parents;
  children;
  constructor(name) {
    this.name = name;
    this.parents = new Set();
    this.children = new Set();
  }
}
export default class InheritanceMap {
  nodes = new Map();
  removeNode(name) {
    const node = this.nodes.get(name);
    if (!node) return;
    for (const parent of node.parents) {
      parent.children.delete(node);
    }
    for (const child of node.children) {
      child.parents.delete(node);
    }
    this.nodes.delete(name);
  }
  getOrCreateNode(name) {
    if (!this.nodes.has(name)) {
      this.nodes.set(name, new TableNode(name));
    }
    return this.getNode(name);
  }
  getNode(name) {
    return this.nodes.get(name);
  }
  setInheritance(name, inherits) {
    const node = this.getOrCreateNode(name);
    const parents = lodash.castArray(inherits).map((name) => this.getOrCreateNode(name));
    node.parents = new Set(parents);
    for (const parent of parents) {
      parent.children.add(node);
    }
  }
  isParentNode(name) {
    const node = this.getNode(name);
    return node && node.children.size > 0;
  }
  getChildren(name, options = { deep: true }) {
    const results = new Set();
    const node = this.getNode(name);
    if (!node) return results;
    for (const child of node.children) {
      results.add(child.name);
      if (!options.deep) {
        continue;
      }
      for (const grandchild of this.getChildren(child.name)) {
        results.add(grandchild);
      }
    }
    return results;
  }
  getParents(name, options = { deep: true }) {
    const results = new Set();
    const node = this.getNode(name);
    if (!node) return results;
    for (const parent of node.parents) {
      results.add(parent.name);
      if (!options.deep) {
        continue;
      }
      for (const grandparent of this.getParents(parent.name)) {
        results.add(grandparent);
      }
    }
    return results;
  }
}
//# sourceMappingURL=inherited-map.js.map
