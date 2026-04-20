/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import 'ses';
export interface FormulaEvaluatorOptions {
  blockedIdentifiers?: string[];
}
export declare function createFormulaEvaluator(options?: FormulaEvaluatorOptions): any;
declare const _default: any;
export default _default;
