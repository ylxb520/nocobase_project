/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BasePluginFeatureManager } from '../features/feature-manager';
export class AIPluginFeatureManagerImpl extends BasePluginFeatureManager {
  get vectorDatabaseProvider() {
    if (!this.features.vectorDatabaseProvider) {
      throw this.featureNotSupportedError('vectorDatabaseProvider');
    }
    return this.features.vectorDatabaseProvider;
  }
  featureNotSupportedError(featureName) {
    return new Error(`${featureName} is not supported`);
  }
}
//# sourceMappingURL=ai-feature-manager.js.map
