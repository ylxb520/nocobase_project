/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Document } from 'flexsearch';
import { Index } from './search-index';
export class DocumentManager {
  indexes = new Map();
  documents = new Map();
  addIndex(name, options) {
    const index = new Index(options);
    this.indexes.set(name, index);
    return index;
  }
  getIndex(name) {
    return this.indexes.get(name);
  }
  addDocument(name, options) {
    const doc = new Document(options);
    this.documents.set(name, doc);
    return doc;
  }
  getDocument(name) {
    return this.documents.get(name);
  }
}
export { Index as FlexSearchIndex } from 'flexsearch';
//# sourceMappingURL=index.js.map
