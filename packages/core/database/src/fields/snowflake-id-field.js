/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DataTypes } from 'sequelize';
import { Field } from './field';
export class SnowflakeIdField extends Field {
  static app;
  static setApp(app) {
    this.app = app;
  }
  get dataType() {
    return DataTypes.BIGINT;
  }
  setId(name, instance) {
    const value = instance.get(name);
    if (!value) {
      const generator = this.constructor.app.snowflakeIdGenerator;
      instance.set(name, generator.generate());
    }
  }
  init() {
    const { name, autoFill } = this.options;
    this.listener = (instance) => {
      if (autoFill === false) {
        return;
      }
      this.setId(name, instance);
    };
    this.bulkListener = async (instances) => {
      if (autoFill === false) {
        return;
      }
      for (const instance of instances) {
        this.setId(name, instance);
      }
    };
  }
  bind() {
    super.bind();
    this.on('beforeValidate', this.listener);
    this.on('beforeSave', this.listener);
    this.on('beforeBulkCreate', this.bulkListener);
  }
  unbind() {
    super.unbind();
    this.off('beforeValidate', this.listener);
    this.off('beforeSave', this.listener);
    this.off('beforeBulkCreate', this.bulkListener);
  }
}
//# sourceMappingURL=snowflake-id-field.js.map
