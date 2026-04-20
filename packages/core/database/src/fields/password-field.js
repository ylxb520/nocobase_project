/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import crypto from 'crypto';
import { DataTypes } from 'sequelize';
import { Field } from './field';
export class PasswordField extends Field {
  get dataType() {
    return DataTypes.STRING;
  }
  async verify(password, hash) {
    password = password || '';
    hash = hash || '';
    const { length = 64, randomBytesSize = 8 } = this.options;
    return new Promise((resolve, reject) => {
      const salt = hash.substring(0, randomBytesSize * 2);
      const key = hash.substring(randomBytesSize * 2);
      crypto.scrypt(password, salt, length / 2 - randomBytesSize, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'));
      });
    });
  }
  async hash(password) {
    const { length = 64, randomBytesSize = 8 } = this.options;
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(randomBytesSize).toString('hex');
      crypto.scrypt(password, salt, length / 2 - randomBytesSize, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + derivedKey.toString('hex'));
      });
    });
  }
  init() {
    const { name } = this.options;
    this.listener = async (instances) => {
      instances = Array.isArray(instances) ? instances : [instances];
      for (const instance of instances) {
        if (!instance.changed(name)) {
          continue;
        }
        const value = instance.get(name);
        if (value) {
          const hash = await this.hash(value);
          instance.set(name, hash);
        } else {
          instance.set(name, instance.previous(name));
        }
      }
    };
  }
  bind() {
    super.bind();
    this.on('beforeCreate', this.listener);
    this.on('beforeBulkCreate', this.listener);
    this.on('beforeUpdate', this.listener);
  }
  unbind() {
    super.unbind();
    this.off('beforeCreate', this.listener);
    this.off('beforeBulkCreate', this.listener);
    this.off('beforeUpdate', this.listener);
  }
}
//# sourceMappingURL=password-field.js.map
