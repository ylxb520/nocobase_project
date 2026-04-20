/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * @internal
 */
export function defineDevPlugins(plugins) {
  Object.entries(plugins).forEach(([packageName, plugin]) => {
    window.define(`${packageName}/client`, () => plugin);
  });
}
/**
 * @internal
 */
export function definePluginClient(packageName) {
  window.define(`${packageName}/client`, ['exports', packageName], function (_exports, _pluginExports) {
    Object.defineProperty(_exports, '__esModule', {
      value: true,
    });
    Object.keys(_pluginExports).forEach(function (key) {
      if (key === '__esModule') return;
      if (key in _exports && _exports[key] === _pluginExports[key]) return;
      Object.defineProperty(_exports, key, {
        enumerable: true,
        get: function () {
          return _pluginExports[key];
        },
      });
    });
  });
}
/**
 * @internal
 */
export function configRequirejs(requirejs, pluginData) {
  requirejs.requirejs.config({
    waitSeconds: 120,
    paths: pluginData.reduce((acc, cur) => {
      acc[cur.packageName] = cur.url;
      return acc;
    }, {}),
  });
}
/**
 * @internal
 */
export function processRemotePlugins(pluginData, resolve) {
  return (...pluginModules) => {
    const res = pluginModules
      .map((item, index) => [pluginData[index].name, item?.default || item])
      .filter((item) => item[1]);
    resolve(res);
    const emptyPlugins = pluginModules
      .map((item, index) => (!item ? index : null))
      .filter((i) => i !== null)
      .map((i) => pluginData[i].packageName);
    if (emptyPlugins.length > 0) {
      console.error(
        '[nocobase load plugin error]: These plugins do not have an `export.default` exported content or there is an error in the plugins. error plugins: \r\n%s',
        emptyPlugins.join(', \r\n'),
      );
    }
  };
}
/**
 * @internal
 */
export function getRemotePlugins(requirejs, pluginData = []) {
  configRequirejs(requirejs, pluginData);
  const packageNames = pluginData.map((item) => item.packageName);
  packageNames.forEach((packageName) => {
    definePluginClient(packageName);
  });
  return new Promise((resolve, reject) => {
    requirejs.requirejs(packageNames, processRemotePlugins(pluginData, resolve), reject);
  });
}
/**
 * @internal
 */
export async function getPlugins(options) {
  const { requirejs, pluginData, devDynamicImport } = options;
  if (pluginData.length === 0) return [];
  const res = [];
  const resolveDevPlugins = {};
  if (devDynamicImport) {
    for await (const plugin of pluginData) {
      const pluginModule = await devDynamicImport(plugin.packageName);
      if (pluginModule) {
        res.push([plugin.name, pluginModule.default]);
        resolveDevPlugins[plugin.packageName] = pluginModule.default;
      }
    }
    defineDevPlugins(resolveDevPlugins);
  }
  const remotePlugins = pluginData.filter((item) => !resolveDevPlugins[item.packageName]);
  if (remotePlugins.length === 0) {
    return res;
  }
  if (res.length === 0) {
    const remotePluginList = await getRemotePlugins(requirejs, remotePlugins);
    res.push(...remotePluginList);
  }
  return res;
}
//# sourceMappingURL=remotePlugins.js.map
