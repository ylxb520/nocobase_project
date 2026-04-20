/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/server';
import { query } from './actions/query';
// import { buildChartBlock } from './ai/tools/build-chart-block';
export class PluginDataVisualizationServer extends Plugin {
  cache;
  afterAdd() {}
  beforeLoad() {
    this.app.resourceManager.define({
      name: 'charts',
      actions: {
        query,
      },
    });
    this.app.acl.allow('charts', 'query', 'loggedIn');
  }
  async load() {
    this.cache = await this.app.cacheManager.createCache({
      name: 'data-visualization',
      store: 'memory',
      ttl: 30 * 1000,
      max: 1000,
    });
    const ai = this.app.pm.get('ai');
    if (ai) {
      // ai.aiManager.toolManager.registerTools([
      //   {
      //     groupName: 'frontend',
      //     tool: buildChartBlock,
      //   },
      // ]);
    }
  }
  async install(options) {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}
export default PluginDataVisualizationServer;
//# sourceMappingURL=plugin.js.map
