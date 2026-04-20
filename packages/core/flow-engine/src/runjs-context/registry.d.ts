/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type RunJSVersion = 'v1' | (string & {});
export type RunJSContextCtor = new (delegate: any) => any;
export type RunJSContextMeta = {
  scenes?: string[];
};
export declare class RunJSContextRegistry {
  private static map;
  static register(version: RunJSVersion, modelClass: string, ctor: RunJSContextCtor, meta?: RunJSContextMeta): void;
  static resolve(version: RunJSVersion, modelClass: string): RunJSContextCtor;
  static getMeta(version: RunJSVersion, modelClass: string): RunJSContextMeta | undefined;
}
export declare function getModelClassName(ctx: any): string;
