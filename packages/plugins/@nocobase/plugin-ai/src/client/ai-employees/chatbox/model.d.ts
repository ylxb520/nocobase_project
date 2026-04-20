/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AIConfigRepository, LLMServiceItem } from '../../repositories/AIConfigRepository';
import { ModelRef } from './stores/chat-box';
export declare const MODEL_PREFERENCE_STORAGE_KEY = 'ai_model_preference_';
export declare const getAllModels: (services: LLMServiceItem[]) => ModelRef[];
export declare const isValidModel: (value: ModelRef | null | undefined, allModels: ModelRef[]) => boolean;
export declare const isSameModel: (a?: ModelRef | null, b?: ModelRef | null) => boolean;
export declare const resolveModel: (
  api: any,
  username: string,
  allModels: ModelRef[],
  currentOverride?: ModelRef | null,
) => ModelRef;
export declare const ensureModel: ({
  api,
  aiConfigRepository,
  username,
  currentOverride,
  onResolved,
}: {
  api: any;
  aiConfigRepository: AIConfigRepository;
  username: string;
  currentOverride?: ModelRef | null;
  onResolved?: (override: ModelRef | null) => void;
}) => Promise<ModelRef | null>;
