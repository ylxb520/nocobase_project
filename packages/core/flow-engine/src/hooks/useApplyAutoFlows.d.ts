/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowModel } from '../models';
/**
 * Hook for applying auto-apply flows on a FlowModel
 * @param model The FlowModel instance
 * @param context Optional user context
 * @returns true if the request is pending
 */
export declare function useApplyAutoFlows(
  modelOrUid: FlowModel | string,
  inputArgs?: Record<string, any>,
  options?: {
    throwOnError?: boolean;
    useCache?: boolean;
  },
): {
  readonly loading: boolean;
  readonly error: Error;
};
