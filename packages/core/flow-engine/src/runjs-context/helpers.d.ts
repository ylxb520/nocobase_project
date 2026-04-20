/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowContext } from '../flowContext';
import { JSRunner } from '../JSRunner';
import type { JSRunnerOptions } from '../JSRunner';
import { type RunJSVersion } from './registry';
export declare function getRunJSDocFor(
  ctx: FlowContext,
  {
    version,
  }?: {
    version?: RunJSVersion;
  },
): any;
export declare function createJSRunnerWithVersion(this: FlowContext, options?: JSRunnerOptions): JSRunner;
export declare function getRunJSScenesForModel(modelClass: string, version?: RunJSVersion): string[];
export declare function getRunJSScenesForContext(
  ctx: FlowContext,
  {
    version,
  }?: {
    version?: RunJSVersion;
  },
): string[];
