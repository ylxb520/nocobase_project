/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DataTypes } from 'sequelize';
import { BaseColumnFieldOptions, Field } from './field';
interface Application {
  snowflakeIdGenerator: {
    generate(): number | BigInt;
  };
}
export declare class SnowflakeIdField extends Field {
  private static app;
  static setApp(app: Application): void;
  get dataType(): DataTypes.BigIntDataTypeConstructor;
  private setId;
  init(): void;
  bind(): void;
  unbind(): void;
}
export interface SnowflakeIdFieldOptions extends BaseColumnFieldOptions {
  type: 'snowflakeId';
  epoch?: number;
}
export {};
