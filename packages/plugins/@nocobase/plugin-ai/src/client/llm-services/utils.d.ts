/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { LLMServiceItem } from '../repositories/AIConfigRepository';
export type ModelWithLabel = {
  llmService: string;
  model: string;
  label: string;
  value: string;
};
export type ProviderOption = {
  value: string;
  label: string;
};
export declare const getServiceByOverride: (
  services: LLMServiceItem[],
  override?: {
    llmService?: string;
  } | null,
) => LLMServiceItem;
export declare const getAllModelsWithLabel: (services: LLMServiceItem[]) => ModelWithLabel[];
export declare const buildProviderGroupedModelOptions: (
  services: LLMServiceItem[],
  providers: ProviderOption[],
  compileLabel?: (label: string) => string,
) => {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}[];
