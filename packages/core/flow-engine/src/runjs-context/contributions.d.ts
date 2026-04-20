/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowRunJSContext } from '../flowContext';
import { RunJSContextRegistry, type RunJSVersion } from './registry';
export type RunJSContextContributionApi = {
  version: RunJSVersion;
  RunJSContextRegistry: typeof RunJSContextRegistry;
  FlowRunJSContext: typeof FlowRunJSContext;
};
export type RunJSContextContribution = (api: RunJSContextContributionApi) => void | Promise<void>;
/**
 * Register a RunJS context/doc contribution.
 *
 * - If RunJS contexts have already been set up for a version, the contribution is applied immediately once.
 * - Each contribution is executed at most once per version.
 */
export declare function registerRunJSContextContribution(contribution: RunJSContextContribution): void;
/**
 * Apply all registered contributions for a given version.
 * Intended to be called by setupRunJSContexts().
 */
export declare function applyRunJSContextContributions(version: RunJSVersion): Promise<void>;
/**
 * Mark setupRunJSContexts() as completed for a given version.
 * Used to support late contributions that should take effect without re-running setup.
 */
export declare function markRunJSContextsSetupDone(version: RunJSVersion): void;
