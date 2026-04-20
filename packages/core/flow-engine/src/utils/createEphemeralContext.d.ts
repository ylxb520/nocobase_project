/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowContext } from '../flowContext';
import type { ActionDefinition } from '../types';
type ContextDefsLike<TCtx extends FlowContext> =
  | Partial<Pick<ActionDefinition<any, TCtx>, 'defineProperties' | 'defineMethods'>>
  | null
  | undefined;
export declare function createEphemeralContext<TCtx extends FlowContext>(
  parent: TCtx,
  contextDefs?: ContextDefsLike<TCtx>,
): Promise<TCtx>;
export {};
