/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { fsExists } from '@nocobase/utils';
import fs from 'fs';
import { resolve } from 'path';
import { getExposeChangelogUrl, getExposeReadmeUrl } from './plugin-manager';
import { checkAndGetCompatible, getPluginBasePath } from './plugin-manager/utils';
import { ToolsLoader } from '@nocobase/ai';
export class Plugin {
  options;
  app;
  /**
   * @deprecated
   */
  model;
  /**
   * @internal
   */
  state = {};
  /**
   * @internal
   */
  _sourceDir;
  constructor(app, options) {
    this.app = app;
    this.setOptions(options);
  }
  get log() {
    return this.app.log.child({
      reqId: this.app.context.reqId,
      module: this.name,
    });
  }
  get name() {
    return this.options.name;
  }
  get ai() {
    return this.app.aiManager;
  }
  get pm() {
    return this.app.pm;
  }
  get db() {
    return this.app.db;
  }
  get enabled() {
    return this.options.enabled;
  }
  set enabled(value) {
    this.options.enabled = value;
  }
  get installed() {
    return this.options.installed;
  }
  set installed(value) {
    this.options.installed = value;
  }
  get isPreset() {
    return this.options.isPreset;
  }
  getName() {
    return this.options.name;
  }
  createLogger(options) {
    return this.app.createLogger(options);
  }
  afterAdd() {}
  beforeLoad() {}
  async load() {}
  async install(options) {}
  async upgrade() {}
  async beforeEnable() {}
  async afterEnable() {}
  async beforeDisable() {}
  async afterDisable() {}
  async beforeRemove() {}
  async afterRemove() {}
  async handleSyncMessage(message) {}
  async sendSyncMessage(message, options) {
    if (!this.name) {
      throw new Error(`plugin name invalid`);
    }
    try {
      await this.app.syncMessageManager.publish(this.name, message, options);
    } catch (err) {
      this.log.error(err);
    }
  }
  /**
   * @deprecated
   */
  async importCollections(collectionsPath) {}
  /**
   * @internal
   */
  setOptions(options) {
    this.options = options || {};
  }
  /**
   * @internal
   */
  async loadMigrations() {
    this.app.log.debug(`load plugin migrations [${this.name}]`);
    const basePath = await this.getPluginBasePath();
    if (!basePath) {
      return { beforeLoad: [], afterSync: [], afterLoad: [] };
    }
    const directory = resolve(basePath, 'server/migrations');
    return await this.app.loadMigrations({
      directory,
      namespace: this.options.packageName,
      context: {
        plugin: this,
      },
    });
  }
  async getPluginBasePath() {
    if (!this.options.packageName) {
      this.app.log.trace(`plugin '${this.name}' is missing packageName`);
      return;
    }
    return getPluginBasePath(this.options.packageName);
  }
  /**
   * @internal
   */
  async loadCollections() {
    const basePath = await this.getPluginBasePath();
    if (!basePath) {
      return;
    }
    const directory = resolve(basePath, 'server/collections');
    if (await fsExists(directory)) {
      this.app.log.trace(`load plugin collections [${this.name}]`);
      await this.db.import({
        directory,
        from: this.options.packageName,
      });
    }
  }
  /**
   * @internal
   */
  async loadAI() {
    const pluginRoot = await this.getPluginBasePath();
    if (!pluginRoot) {
      return;
    }
    const basePath = resolve(pluginRoot, 'ai');
    if (!(await fsExists(basePath))) {
      return;
    }
    const toolsLoader = new ToolsLoader(this.ai, {
      scan: {
        basePath,
        pattern: ['**/tools/**/*.ts', '**/tools/**/*.js', '!**/tools/**/*.d.ts', '**/tools/**/*/description.md'],
      },
      log: this.log,
    });
    await toolsLoader.load();
  }
  /**
   * @deprecated
   */
  requiredPlugins() {
    return [];
  }
  t(text, options = {}) {
    return this.app.i18n.t(text, { ns: this.options['packageName'], ...options });
  }
  /**
   * @experimental
   */
  async toJSON(options = {}) {
    const { locale = 'en-US' } = options;
    const { name, packageName, packageJson } = this.options;
    if (!packageName) {
      return {
        ...this.options,
      };
    }
    const langMap = {
      'zh-CN': 'cn/',
      'en-US': '',
      'ja-JP': 'ja/',
      'ko-KR': 'ko/',
      'es-ES': 'es/',
      'pt-PT': 'pt/',
      'de-DE': 'de',
      'fr-FR': 'fr/',
    };
    if (packageName.startsWith('@nocobase/plugin-')) {
      packageJson.homepage = `https://v2.docs.nocobase.com/${langMap[locale] || ''}plugins/${packageName}`;
    }
    const results = {
      ...this.options,
      keywords: packageJson.keywords,
      readmeUrl: getExposeReadmeUrl(packageName, locale),
      changelogUrl: getExposeChangelogUrl(packageName),
      displayName: packageJson[`displayName.${locale}`] || packageJson.displayName || name,
      description: packageJson[`description.${locale}`] || packageJson.description,
      homepage: packageJson.homepage,
    };
    if (!options.withOutOpenFile) {
      const file = await fs.promises.realpath(
        resolve(process.env.NODE_MODULES_PATH || resolve(process.cwd(), 'node_modules'), packageName),
      );
      return {
        ...results,
        ...(await checkAndGetCompatible(packageName)),
        lastUpdated: (await fs.promises.stat(file)).ctime,
        file,
        updatable: file.startsWith(process.env.PLUGIN_STORAGE_PATH),
      };
    }
    return results;
  }
}
export default Plugin;
//# sourceMappingURL=plugin.js.map
