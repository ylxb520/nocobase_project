/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { CollectionField } from '../data-source';
import { FlowEngineContext } from '../flowContext';
import { DefaultStructure } from '../types';
import { FlowModel } from './flowModel';
export declare function FieldPlaceholder({ title }: { title: any }): React.JSX.Element;
export declare function FieldDeletePlaceholder(): React.JSX.Element;
export interface FieldSettingsInitParams {
  dataSourceKey: string;
  collectionName: string;
  fieldPath: string;
  associationPathName?: string;
}
export interface BindingOptions {
  modelName: string;
  isDefault: boolean;
  defaultProps: object | ((ctx: FlowEngineContext, fieldInstance: CollectionField) => object) | null;
  when: (ctx: FlowEngineContext, fieldInstance: CollectionField) => boolean;
}
export declare class CollectionFieldModel<T extends DefaultStructure = DefaultStructure> extends FlowModel<T> {
  private static _bindings;
  renderHiddenInConfig(): React.ReactNode | undefined;
  get title(): any;
  onInit(options: any): void;
  getFieldSettingsInitParams(): FieldSettingsInitParams;
  get fieldPath(): string;
  get associationPathName(): string;
  get collectionField(): CollectionField;
  afterAddAsSubModel(): Promise<void>;
  static getBindingsByField(ctx: FlowEngineContext, collectionField: CollectionField): BindingOptions[];
  static getDefaultBindingByField(
    ctx: FlowEngineContext,
    collectionField: CollectionField,
    options?: {
      useStrict?: boolean;
      fallbackToTargetTitleField?: boolean;
      targetCollectionTitleField?: CollectionField;
    },
  ): BindingOptions | null;
  static bindModelToInterface(
    modelName: string,
    interfaceName: string | string[],
    options?: {
      isDefault?: boolean;
      order?: number;
      defaultProps?: object | ((ctx: FlowEngineContext, fieldInstance: CollectionField) => object);
      when?: (ctx: FlowEngineContext, fieldInstance: CollectionField) => boolean;
    },
  ): void;
  private static get currentBindings();
  static getAllParentClasses(): any[];
  static get bindings(): Map<any, any>;
  renderItem(): any;
  render(): any;
}
