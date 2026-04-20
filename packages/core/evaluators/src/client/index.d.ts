/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils/client';
export interface Evaluator {
  label: string;
  tooltip?: string;
  link?: string;
  evaluate(
    exp: string,
    scope?: {
      [key: string]: any;
    },
  ): any;
}
export declare const evaluators: Registry<Evaluator>;
export declare function getOptions(): any[];
export default evaluators;
