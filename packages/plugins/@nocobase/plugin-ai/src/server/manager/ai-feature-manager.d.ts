/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type {
  AIPluginFeatureManager,
  AIPluginFeatures,
  KnowledgeBaseFeature,
  VectorDatabaseFeature,
  VectorDatabaseProviderFeature,
  VectorStoreProviderFeature,
  PluginFeatureKeys,
} from '../features';
import { BasePluginFeatureManager } from '../features';
export declare class AIPluginFeatureManagerImpl
  extends BasePluginFeatureManager<AIPluginFeatures>
  implements AIPluginFeatureManager
{
  get vectorDatabase(): VectorDatabaseFeature;
  get vectorDatabaseProvider(): VectorDatabaseProviderFeature;
  get vectorStoreProvider(): VectorStoreProviderFeature;
  get knowledgeBase(): KnowledgeBaseFeature;
  private featureNotSupportedError;
}
export declare const EEFeatures: PluginFeatureKeys<AIPluginFeatures>;
