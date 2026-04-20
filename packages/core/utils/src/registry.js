/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class Registry {
  map = new Map();
  options;
  constructor(options = { override: false }) {
    this.options = options;
  }
  register(key, value) {
    if (!this.options.override && this.map.has(key)) {
      throw new Error(`this registry does not allow to override existing keys: "${key}"`);
    }
    this.map.set(key, value);
  }
  // async import({ directory, extensions = ['.js', '.ts', '.json'] }) {
  //   const files = await fs.readdir(directory);
  //   return files.filter(file => extensions.includes(path.extname(file)))
  // }
  get(key) {
    return this.map.get(key);
  }
  getKeys() {
    return this.map.keys();
  }
  getValues() {
    return this.map.values();
  }
  getEntities() {
    return this.map.entries();
  }
}
export default Registry;
//# sourceMappingURL=registry.js.map
