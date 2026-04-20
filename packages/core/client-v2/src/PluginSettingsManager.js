/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { set } from 'lodash';
import { Outlet } from 'react-router-dom';
export const ADMIN_SETTINGS_KEY = 'admin.settings.';
export const ADMIN_SETTINGS_PATH = '/admin/settings/';
export const SNIPPET_PREFIX = 'pm.';
export class PluginSettingsManager {
  settings = {};
  aclSnippets = [];
  app;
  cachedList = {};
  constructor(_pluginSettings, app) {
    this.app = app;
    Object.entries(_pluginSettings || {}).forEach(([name, pluginSettingOptions]) => {
      this.add(name, pluginSettingOptions);
    });
  }
  clearCache() {
    this.cachedList = {};
  }
  setAclSnippets(aclSnippets) {
    this.aclSnippets = aclSnippets;
  }
  getAclSnippet(name) {
    const setting = this.settings[name];
    if (setting?.skipAclConfigure) {
      return null;
    }
    return setting?.aclSnippet ? setting.aclSnippet : `${SNIPPET_PREFIX}${name}`;
  }
  getRouteName(name) {
    return `${ADMIN_SETTINGS_KEY}${name}`;
  }
  getRoutePath(name) {
    return `${ADMIN_SETTINGS_PATH}${name.replaceAll('.', '/')}`;
  }
  add(name, options) {
    const nameArr = name.split('.');
    const topLevelName = nameArr[0];
    this.settings[name] = {
      ...this.settings[name],
      Component: Outlet,
      ...options,
      name,
      topLevelName: options.topLevelName || topLevelName,
    };
    // add children
    if (nameArr.length > 1) {
      set(this.settings, nameArr.join('.children.'), this.settings[name]);
    }
    // add route
    this.app.router.add(this.getRouteName(name), {
      path: this.getRoutePath(name),
      Component: this.settings[name].Component,
    });
  }
  remove(name) {
    // delete self and children
    Object.keys(this.settings).forEach((key) => {
      if (key.startsWith(name)) {
        delete this.settings[key];
        this.app.router.remove(`${ADMIN_SETTINGS_KEY}${key}`);
      }
    });
  }
  hasAuth(name) {
    if (this.aclSnippets.includes(`!${this.getAclSnippet('*')}`)) return false;
    return this.aclSnippets.includes(`!${this.getAclSnippet(name)}`) === false;
  }
  getSetting(name) {
    return this.settings[name];
  }
  has(name) {
    const hasAuth = this.hasAuth(name);
    if (!hasAuth) return false;
    return !!this.getSetting(name);
  }
  get(name, filterAuth = true) {
    const isAllow = this.hasAuth(name);
    const pluginSetting = this.getSetting(name);
    if ((filterAuth && !isAllow) || !pluginSetting) return null;
    const children = Object.keys(pluginSetting.children || {})
      .sort((a, b) => a.localeCompare(b)) // sort by name
      .map((key) => this.get(pluginSetting.children[key].name, filterAuth))
      .filter(Boolean)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));
    const { title, icon, aclSnippet, ...others } = pluginSetting;
    return {
      isTopLevel: name === pluginSetting.topLevelName,
      ...others,
      aclSnippet: this.getAclSnippet(name),
      title,
      isAllow,
      label: title,
      icon: this.app.flowEngine.context.renderIon?.(icon),
      path: this.getRoutePath(name),
      key: name,
      children: children.length ? children : undefined,
    };
  }
  getList(filterAuth = true) {
    const cacheKey = JSON.stringify(filterAuth);
    if (this.cachedList[cacheKey]) return this.cachedList[cacheKey];
    return (this.cachedList[cacheKey] = Array.from(
      new Set(Object.values(this.settings).map((item) => item.topLevelName)),
    )
      .sort((a, b) => a.localeCompare(b)) // sort by name
      .map((name) => this.get(name, filterAuth))
      .filter(Boolean)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0)));
  }
  getAclSnippets() {
    return Object.keys(this.settings)
      .map((name) => this.getAclSnippet(name))
      .filter(Boolean);
  }
}
//# sourceMappingURL=PluginSettingsManager.js.map
