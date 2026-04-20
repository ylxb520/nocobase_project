/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * NocoBase officially recommended models for each LLM provider.
 * These models are tested to ensure quality and compatibility.
 */
export declare const recommendedModels: Record<
  string,
  {
    label: string;
    value: string;
  }[]
>;
/**
 * Check if a model is recommended for a given provider
 */
export declare const isRecommendedModel: (provider: string, modelId: string) => boolean;
/**
 * Get recommended models for a provider
 */
export declare const getRecommendedModels: (provider: string) => {
  label: string;
  value: string;
}[];
