/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export interface EnabledModelsConfig {
  mode: 'recommended' | 'provider' | 'custom';
  models: Array<{
    label: string;
    value: string;
  }>;
}
/**
 * Strip known prefixes from a model ID.
 */
export declare const stripModelIdPrefix: (id: string) => string;
export declare const capitalize: (s: string) => string;
/**
 * Merge consecutive short (≤2 digit) numeric segments with '.'.
 * e.g. ["claude","opus","4","5","20251101"] → ["claude","opus","4.5","20251101"]
 */
export declare const mergeVersionSegments: (segments: string[]) => string[];
/**
 * Default fallback: space-separated, version-merged.
 */
export declare const formatModelLabel: (id: string) => string;
/**
 * Normalize old `string[]` format to new `EnabledModelsConfig`.
 * Also handles null/undefined gracefully.
 */
export declare const normalizeEnabledModels: (value: unknown) => EnabledModelsConfig;
export declare const EnabledModelsSelect: React.FC<any>;
