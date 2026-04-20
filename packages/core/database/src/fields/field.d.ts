/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DataType, ModelAttributeColumnOptions, ModelIndexesOptions, SyncOptions, Transactionable } from 'sequelize';
import { Collection } from '../collection';
import { Database } from '../database';
import { ModelEventTypes } from '../types';
import { BasicType, BooleanSchema, NumberSchema, ObjectSchema, StringSchema } from 'joi';
export interface FieldContext {
  database: Database;
  collection: Collection;
}
type RuleSchemaMap = {
  string: StringSchema;
  boolean: BooleanSchema;
  number: NumberSchema;
  object: ObjectSchema;
};
export type FieldValidationRuleName<T extends BasicType> = T extends keyof RuleSchemaMap
  ? keyof RuleSchemaMap[T]
  : never;
export interface FieldValidationRule<T extends BasicType> {
  key: string;
  name: FieldValidationRuleName<T>;
  args?: {
    [key: string]: any;
  };
  paramsType?: 'object';
}
export interface ValidationOptions<T extends BasicType = BasicType> {
  type: T;
  rules: FieldValidationRule<T>[];
  [key: string]: any;
}
export interface BaseFieldOptions<T extends BasicType = BasicType> {
  name?: string;
  hidden?: boolean;
  translation?: boolean;
  validation?: ValidationOptions<T>;
  [key: string]: any;
}
export interface BaseColumnFieldOptions<T extends BasicType = BasicType>
  extends BaseFieldOptions<T>,
    Omit<ModelAttributeColumnOptions, 'type'> {
  dataType?: DataType;
  index?: boolean | ModelIndexesOptions;
}
export declare abstract class Field {
  options: any;
  context: FieldContext;
  database: Database;
  collection: Collection;
  [key: string]: any;
  constructor(options?: any, context?: FieldContext);
  get name(): any;
  get type(): any;
  abstract get dataType(): any;
  isRelationField(): boolean;
  sync(syncOptions: SyncOptions): Promise<void>;
  init(): void;
  on(eventName: ModelEventTypes, listener: (...args: any[]) => void): this;
  off(eventName: string, listener: (...args: any[]) => void): this;
  get(name: string): any;
  remove(): void | Field;
  columnName(): any;
  existsInDb(options?: Transactionable): Promise<boolean>;
  merge(obj: any): void;
  bind(): void;
  unbind(): void;
  toSequelize(): any;
  additionalSequelizeOptions(): {};
  typeToString(): any;
}
export {};
