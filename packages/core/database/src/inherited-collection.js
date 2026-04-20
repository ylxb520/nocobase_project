/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { default as lodash } from 'lodash';
import { Collection } from './collection';
export class InheritedCollection extends Collection {
  parents;
  constructor(options, context) {
    if (!options.inherits) {
      throw new Error('InheritedCollection must have inherits option');
    }
    options.inherits = lodash.castArray(options.inherits);
    super(options, context);
    try {
      this.bindParents();
    } catch (err) {
      if (err instanceof ParentCollectionNotFound) {
        const listener = (collection) => {
          if (
            options.inherits.includes(collection.name) &&
            options.inherits.every((name) => this.db.collections.has(name))
          ) {
            this.bindParents();
            this.db.removeListener('afterDefineCollection', listener);
          }
        };
        this.db.addListener('afterDefineCollection', listener);
      } else {
        throw err;
      }
    }
  }
  getParents() {
    return this.parents;
  }
  getFlatParents() {
    // get parents as flat array
    const parents = [];
    for (const parent of this.parents) {
      if (parent.isInherited()) {
        parents.push(...parent.getFlatParents());
      }
      parents.push(parent);
    }
    return parents;
  }
  parentFields() {
    const fields = new Map();
    if (!this.parents) {
      return fields;
    }
    for (const parent of this.parents) {
      if (parent.isInherited()) {
        for (const [name, field] of parent.parentFields()) {
          fields.set(name, field);
        }
      }
      const parentFields = parent.fields;
      for (const [name, field] of parentFields) {
        fields.set(name, field);
      }
    }
    return fields;
  }
  parentAttributes() {
    const attributes = {};
    for (const parent of this.parents) {
      if (parent.isInherited()) {
        Object.assign(attributes, parent.parentAttributes());
      }
      const parentAttributes = parent.model.tableAttributes;
      Object.assign(attributes, parentAttributes);
    }
    return attributes;
  }
  isInherited() {
    return true;
  }
  bindParents() {
    this.setParents(this.options.inherits);
    this.setParentFields();
    this.setFields(this.options.fields, false);
    this.db.inheritanceMap.setInheritance(this.name, this.options.inherits);
  }
  setParents(inherits) {
    this.parents = lodash.castArray(inherits).map((name) => {
      const existCollection = this.db.collections.get(name);
      if (!existCollection) {
        throw new ParentCollectionNotFound(name);
      }
      return existCollection;
    });
  }
  setParentFields() {
    const delayFields = new Map();
    for (const [name, field] of this.parentFields()) {
      if (field.isRelationField()) {
        delayFields.set(name, field);
        continue;
      }
      this.setField(name, {
        ...field.options,
        inherit: true,
      });
    }
    for (const [name, field] of delayFields) {
      this.setField(name, {
        ...field.options,
        inherit: true,
      });
    }
  }
}
class ParentCollectionNotFound extends Error {
  constructor(name) {
    super(`parent collection ${name} not found`);
  }
}
//# sourceMappingURL=inherited-collection.js.map
