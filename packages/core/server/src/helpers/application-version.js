/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import semver from 'semver';
export class ApplicationVersion {
  app;
  collection;
  constructor(app) {
    this.app = app;
    app.db.collection({
      origin: '@nocobase/server',
      name: 'applicationVersion',
      migrationRules: ['schema-only'],
      dataType: 'meta',
      timestamps: false,
      dumpRules: 'required',
      fields: [{ name: 'value', type: 'string' }],
    });
    this.collection = this.app.db.getCollection('applicationVersion');
  }
  async get() {
    const model = await this.collection.model.findOne();
    if (!model) {
      return null;
    }
    return model.get('value');
  }
  async update(version) {
    await this.collection.model.destroy({
      truncate: true,
    });
    await this.collection.model.create({
      value: version || this.app.getVersion(),
    });
  }
  async satisfies(range) {
    const model = await this.collection.model.findOne();
    const version = model?.value;
    if (!version) {
      return true;
    }
    return semver.satisfies(version, range, { includePrerelease: true });
  }
}
//# sourceMappingURL=application-version.js.map
