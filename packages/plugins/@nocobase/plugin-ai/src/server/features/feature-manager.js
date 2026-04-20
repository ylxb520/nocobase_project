/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class BasePluginFeatureManager {
  features = {};
  enableFeatures(features) {
    this.features = {
      ...this.features,
      ...features,
    };
  }
  disableFeatures(features) {
    for (const feature of features) {
      if (this.features[feature]) {
        delete this.features[feature];
      }
    }
  }
  isFeaturesEnabled(features) {
    return Array.from(features).every((f) => this.features[f]);
  }
}
//# sourceMappingURL=feature-manager.js.map
