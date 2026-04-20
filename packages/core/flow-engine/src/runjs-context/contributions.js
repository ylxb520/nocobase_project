/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowRunJSContext } from '../flowContext';
import { RunJSContextRegistry } from './registry';
const contributions = new Set();
const appliedByVersion = new Map();
const setupDoneVersions = new Set();
async function applyContributionOnce(version, contribution) {
  const applied = appliedByVersion.get(version) || new Set();
  appliedByVersion.set(version, applied);
  if (applied.has(contribution)) return;
  // Mark as applied before awaiting to avoid duplicate runs on concurrency.
  // If it fails, remove the marker so a later setup retry can re-apply.
  applied.add(contribution);
  try {
    await contribution({
      version,
      RunJSContextRegistry,
      FlowRunJSContext,
    });
  } catch (error) {
    applied.delete(contribution);
    throw error;
  }
}
/**
 * Register a RunJS context/doc contribution.
 *
 * - If RunJS contexts have already been set up for a version, the contribution is applied immediately once.
 * - Each contribution is executed at most once per version.
 */
export function registerRunJSContextContribution(contribution) {
  if (typeof contribution !== 'function') {
    throw new Error('[flow-engine] registerRunJSContextContribution: contribution must be a function');
  }
  if (contributions.has(contribution)) return;
  contributions.add(contribution);
  // Apply immediately for already-setup versions (late registration).
  for (const version of setupDoneVersions) {
    void applyContributionOnce(version, contribution).catch((error) => {
      // Avoid unhandled rejections in late registrations
      try {
        // eslint-disable-next-line no-console
        console.error('[flow-engine] RunJS context contribution failed:', error);
      } catch (_) {
        void 0;
      }
    });
  }
}
/**
 * Apply all registered contributions for a given version.
 * Intended to be called by setupRunJSContexts().
 */
export async function applyRunJSContextContributions(version) {
  for (const contribution of contributions) {
    await applyContributionOnce(version, contribution);
  }
}
/**
 * Mark setupRunJSContexts() as completed for a given version.
 * Used to support late contributions that should take effect without re-running setup.
 */
export function markRunJSContextsSetupDone(version) {
  setupDoneVersions.add(version);
}
//# sourceMappingURL=contributions.js.map
