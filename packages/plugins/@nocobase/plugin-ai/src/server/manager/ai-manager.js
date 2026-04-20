/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ToolManager } from './tool-manager';
export var SupportedModel;
(function (SupportedModel) {
  SupportedModel['LLM'] = 'LLM';
  SupportedModel['EMBEDDING'] = 'EMBEDDING';
})(SupportedModel || (SupportedModel = {}));
export class AIManager {
  plugin;
  llmProviders = new Map();
  toolManager = new ToolManager();
  constructor(plugin) {
    this.plugin = plugin;
  }
  registerLLMProvider(name, meta) {
    this.llmProviders.set(name, meta);
  }
  listLLMProviders() {
    const providers = this.llmProviders.entries();
    return Array.from(providers).map(([name, { title, supportedModel, supportWebSearch }]) => ({
      name,
      title,
      supportedModel: supportedModel ?? [SupportedModel.LLM],
      supportWebSearch: supportWebSearch ?? false,
    }));
  }
  getSupportedProvider(model) {
    return Array.from(this.llmProviders.entries())
      .filter(([_, { supportedModel }]) => supportedModel && supportedModel.includes(model))
      .map(([name]) => name);
  }
}
//# sourceMappingURL=ai-manager.js.map
