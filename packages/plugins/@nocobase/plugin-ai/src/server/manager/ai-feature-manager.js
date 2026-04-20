/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BasePluginFeatureManager } from '../features';
export class AIPluginFeatureManagerImpl extends BasePluginFeatureManager {
  get vectorDatabase() {
    if (!this.features.vectorDatabase) {
      throw this.featureNotSupportedError('vectorDatabase');
    }
    return this.features.vectorDatabase;
  }
  get vectorDatabaseProvider() {
    if (!this.features.vectorDatabaseProvider) {
      throw this.featureNotSupportedError('vectorDatabaseProvider');
    }
    return this.features.vectorDatabaseProvider;
  }
  get vectorStoreProvider() {
    if (!this.features.vectorStoreProvider) {
      throw this.featureNotSupportedError('vectorStoreProvider');
    }
    return this.features.vectorStoreProvider;
  }
  get knowledgeBase() {
    if (!this.features.vectorStoreProvider) {
      throw this.featureNotSupportedError('knowledgeBase');
    }
    return this.features.knowledgeBase;
  }
  featureNotSupportedError(featureName) {
    return new Error(`${featureName} is not supported`);
  }
}
export const EEFeatures = {
  vectorDatabase: 'vectorDatabase',
  vectorDatabaseProvider: 'vectorDatabaseProvider',
  vectorStoreProvider: 'vectorStoreProvider',
  knowledgeBase: 'knowledgeBase',
};
//# sourceMappingURL=ai-feature-manager.js.map
