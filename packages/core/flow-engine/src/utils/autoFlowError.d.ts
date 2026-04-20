/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * Per-model AutoFlow error storage with proper typing, avoiding ad-hoc properties.
 */
import type { FlowModel } from '../models';
export type AutoFlowError = Error | null;
export declare function setAutoFlowError(model: FlowModel, err: AutoFlowError): void;
export declare function getAutoFlowError(model: FlowModel): AutoFlowError;
export declare function clearAutoFlowError(model: FlowModel): void;
