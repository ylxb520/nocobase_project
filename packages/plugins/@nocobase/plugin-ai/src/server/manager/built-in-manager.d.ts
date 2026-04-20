/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import PluginAIServer from '../plugin';
import type { AIEmployee } from '../../collections/ai-employees';
export declare class BuiltInManager {
  protected plugin: PluginAIServer;
  private builtInEmployees;
  private builtInEmployeeMap;
  constructor(plugin: PluginAIServer);
  setupBuiltInInfo(locale: string, aiEmployee: AIEmployee): void;
  createOrUpdateAIEmployee(language?: string): Promise<void>;
}
