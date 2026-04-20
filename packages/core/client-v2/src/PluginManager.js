/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { getPlugins } from './utils/remotePlugins';
export class PluginManager {
  _plugins;
  loadRemotePlugins;
  app;
  pluginInstances = new Map();
  pluginsAliases = {};
  initPlugins;
  constructor(_plugins, loadRemotePlugins, app) {
    this._plugins = _plugins;
    this.loadRemotePlugins = loadRemotePlugins;
    this.app = app;
    this.app = app;
    this.initPlugins = this.init(_plugins);
  }
  /**
   * @internal
   */
  async init(_plugins) {
    await this.initStaticPlugins(_plugins);
    if (this.loadRemotePlugins) {
      await this.initRemotePlugins();
    }
  }
  async initStaticPlugins(_plugins = []) {
    for await (const plugin of _plugins) {
      const pluginClass = Array.isArray(plugin) ? plugin[0] : plugin;
      const opts = Array.isArray(plugin) ? plugin[1] : undefined;
      await this.add(pluginClass, opts);
    }
  }
  async initRemotePlugins() {
    const res = await this.app.apiClient.request({ url: 'pm:listEnabled' });
    const pluginList = res?.data?.data || [];
    const plugins = await getPlugins({
      requirejs: this.app.requirejs,
      pluginData: pluginList,
      devDynamicImport: this.app.devDynamicImport,
    });
    for await (const [name, pluginClass] of plugins) {
      const info = pluginList.find((item) => item.name === name);
      await this.add(pluginClass, info);
    }
  }
  async add(plugin, opts = {}) {
    const instance = this.getInstance(plugin, opts);
    this.pluginInstances.set(plugin, instance);
    if (opts.name) {
      this.pluginsAliases[opts.name] = instance;
    }
    if (opts.packageName) {
      this.pluginsAliases[opts.packageName] = instance;
    }
    await instance.afterAdd();
  }
  get(nameOrPluginClass) {
    if (typeof nameOrPluginClass === 'string') {
      return this.pluginsAliases[nameOrPluginClass];
    }
    return this.pluginInstances.get(nameOrPluginClass.default || nameOrPluginClass);
  }
  getInstance(plugin, opts) {
    return new plugin(opts, this.app);
  }
  /**
   * @internal
   */
  async load() {
    await this.initPlugins;
    for (const plugin of this.pluginInstances.values()) {
      await plugin.beforeLoad();
    }
    for (const plugin of this.pluginInstances.values()) {
      await plugin.load();
      this.app.eventBus.dispatchEvent(new CustomEvent(`plugin:${plugin.options.name}:loaded`, { detail: plugin }));
    }
  }
}
//# sourceMappingURL=PluginManager.js.map
