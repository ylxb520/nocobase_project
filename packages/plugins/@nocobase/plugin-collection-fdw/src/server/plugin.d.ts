/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { Plugin } from '@nocobase/server';
export default class PluginCollectionFDWServer extends Plugin {
  beforeLoad(): Promise<void>;
  load(): Promise<void>;
  beforeEnable(): Promise<void>;
}
