/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AIPluginFeatureManager, AIPluginFeatures, VectorDatabaseProviderFeature } from '../features';
import { BasePluginFeatureManager } from '../features/feature-manager';
export declare class AIPluginFeatureManagerImpl
  extends BasePluginFeatureManager<AIPluginFeatures>
  implements AIPluginFeatureManager
{
  get vectorDatabaseProvider(): VectorDatabaseProviderFeature;
  private featureNotSupportedError;
}
