/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { registerActions } from '@nocobase/actions';
import { actions as authActions, AuthManager } from '@nocobase/auth';
import { DataSourceManager, SequelizeCollectionManager } from '@nocobase/data-source-manager';
import Database from '@nocobase/database';
import { createLogger, createSystemLogger, getLoggerFilePath } from '@nocobase/logger';
import { Telemetry } from '@nocobase/telemetry';
import { AIManager } from '@nocobase/ai';
import { LockManager } from '@nocobase/lock-manager';
import { Snowflake } from '@nocobase/snowflake-id';
import { applyMixins, AsyncEmitter, importModule, Toposort, wrapMiddlewareWithLogging } from '@nocobase/utils';
import { randomUUID } from 'crypto';
import glob from 'glob';
import Koa from 'koa';
import compose from 'koa-compose';
import lodash from 'lodash';
import path, { basename, resolve } from 'path';
import semver from 'semver';
import { createACL } from './acl';
import { AppCommand } from './app-command';
import { AppSupervisor } from './app-supervisor';
import { createCacheManager } from './cache';
import { registerCli } from './commands';
import { CronJobManager } from './cron/cron-job-manager';
import { ApplicationNotInstall } from './errors/application-not-install';
import {
  createAppProxy,
  createI18n,
  createResourcer,
  enablePerfHooks,
  getCommandFullName,
  registerMiddlewares,
} from './helper';
import { ApplicationVersion } from './helpers/application-version';
import { Locale } from './locale';
import { MainDataSource } from './main-data-source';
import { parseVariables } from './middlewares';
import { dataTemplate } from './middlewares/data-template';
import validateFilterParams from './middlewares/validate-filter-params';
import { PluginManager } from './plugin-manager';
import { createPubSubManager } from './pub-sub-manager';
import { SyncMessageManager } from './sync-message-manager';
import packageJson from '../package.json';
import { availableActions } from './acl/available-action';
import AesEncryptor from './aes-encryptor';
import { AuditManager } from './audit-manager';
import { Environment } from './environment';
import { EventQueue } from './event-queue';
import { RedisConnectionManager } from './redis-connection-manager';
import { ServiceContainer } from './service-container';
import { setupSnowflakeIdField } from './snowflake-id-field';
import { WorkerIdAllocator } from './worker-id-allocator';
export class Application extends Koa {
  options;
  _instanceId;
  /**
   * @internal
   */
  stopped = false;
  /**
   * @internal
   */
  ready = false;
  /**
   * @internal
   */
  rawOptions;
  /**
   * @internal
   */
  activatedCommand = null;
  /**
   * @internal
   */
  running = false;
  /**
   * @internal
   */
  perfHistograms = new Map();
  /**
   * @internal
   */
  redisConnectionManager;
  workerIdAllocator;
  snowflakeIdGenerator;
  aiManager;
  pubSubManager;
  syncMessageManager;
  requestLogger;
  plugins = new Map();
  _appSupervisor = AppSupervisor.getInstance();
  _authenticated = false;
  _maintaining = false;
  _maintainingCommandStatus;
  _maintainingStatusBeforeCommand;
  _actionCommand;
  container = new ServiceContainer();
  lockManager;
  eventQueue;
  constructor(options) {
    super();
    this.options = options;
    this.context.reqId = randomUUID();
    this.rawOptions = this.name == 'main' ? lodash.cloneDeep(options) : {};
    this.init();
    if (!options.skipSupervisor) {
      this._appSupervisor.addApp(this);
    }
  }
  static staticCommands = [];
  static registerStaticCommand(callback) {
    this.staticCommands.push(callback);
  }
  static addCommand(callback) {
    this.staticCommands.push(callback);
  }
  _sqlLogger;
  get instanceId() {
    return this._instanceId;
  }
  get sqlLogger() {
    return this._sqlLogger;
  }
  _logger;
  get logger() {
    return this._logger;
  }
  _started = null;
  /**
   * @experimental
   */
  get started() {
    return this._started;
  }
  get log() {
    return this._logger;
  }
  _loaded;
  /**
   * @internal
   */
  get loaded() {
    return this._loaded;
  }
  _maintainingMessage;
  /**
   * @internal
   */
  get maintainingMessage() {
    return this._maintainingMessage;
  }
  _env;
  get environment() {
    return this._env;
  }
  _cronJobManager;
  get cronJobManager() {
    return this._cronJobManager;
  }
  get mainDataSource() {
    return this.dataSourceManager?.dataSources.get('main');
  }
  get db() {
    if (!this.mainDataSource) {
      return null;
    }
    // @ts-ignore
    return this.mainDataSource.collectionManager.db;
  }
  get resourceManager() {
    return this.mainDataSource.resourceManager;
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link #resourceManager} instead.
   * @deprecated
   */
  get resourcer() {
    return this.mainDataSource.resourceManager;
  }
  _cacheManager;
  get cacheManager() {
    return this._cacheManager;
  }
  _cache;
  get cache() {
    return this._cache;
  }
  /**
   * @internal
   */
  set cache(cache) {
    this._cache = cache;
  }
  _cli;
  get cli() {
    return this._cli;
  }
  _i18n;
  get i18n() {
    return this._i18n;
  }
  _pm;
  get pm() {
    return this._pm;
  }
  get acl() {
    return this.mainDataSource.acl;
  }
  _authManager;
  get authManager() {
    return this._authManager;
  }
  _auditManager;
  get auditManager() {
    return this._auditManager;
  }
  _locales;
  /**
   * This method is deprecated and should not be used.
   * Use {@link #localeManager} instead.
   * @deprecated
   */
  get locales() {
    return this._locales;
  }
  get localeManager() {
    return this._locales;
  }
  _telemetry;
  get telemetry() {
    return this._telemetry;
  }
  _version;
  get version() {
    return this._version;
  }
  get name() {
    return this.options.name || 'main';
  }
  _dataSourceManager;
  get dataSourceManager() {
    return this._dataSourceManager;
  }
  _aesEncryptor;
  get aesEncryptor() {
    return this._aesEncryptor;
  }
  /**
   * Check if the application is serving as a specific worker.
   * @experimental
   */
  serving(key) {
    const { WORKER_MODE = '' } = process.env;
    if (!WORKER_MODE) {
      return true;
    }
    if (WORKER_MODE === '-') {
      return false;
    }
    const topics = WORKER_MODE.trim().split(',');
    if (key) {
      if (WORKER_MODE === '*') {
        return true;
      }
      if (topics.includes(key)) {
        return true;
      }
      return false;
    } else {
      if (topics.includes('!')) {
        return true;
      }
      return false;
    }
  }
  /**
   * @internal
   */
  getMaintaining() {
    return this._maintainingCommandStatus;
  }
  /**
   * @internal
   */
  async setMaintaining(_maintainingCommandStatus) {
    this._maintainingCommandStatus = _maintainingCommandStatus;
    await this.emitAsync('maintaining', _maintainingCommandStatus);
    if (_maintainingCommandStatus.status == 'command_end') {
      this._maintaining = false;
      return;
    }
    this._maintaining = true;
  }
  /**
   * @internal
   */
  setMaintainingMessage(message) {
    this._maintainingMessage = message;
    this.emit('maintainingMessageChanged', {
      message: this._maintainingMessage,
      maintainingStatus: this._maintainingCommandStatus,
    });
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link #this.getPackageVersion} instead.
   * @deprecated
   */
  getVersion() {
    return packageJson.version;
  }
  getPackageVersion() {
    return packageJson.version;
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link #this.pm.addPreset()} instead.
   * @deprecated
   */
  plugin(pluginClass, options) {
    this.log.debug(`add plugin`, { method: 'plugin', name: pluginClass.name });
    this.pm.addPreset(pluginClass, options);
  }
  // @ts-ignore
  use(middleware, options) {
    this.middleware.add(wrapMiddlewareWithLogging(middleware, this.logger), options);
    return this;
  }
  /**
   * @internal
   */
  callback() {
    const fn = compose(this.middleware.nodes);
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    return (req, res) => {
      const ctx = this.createContext(req, res);
      // @ts-ignore
      return this.handleRequest(ctx, fn);
    };
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link #this.db.collection()} instead.
   * @deprecated
   */
  collection(options) {
    return this.db.collection(options);
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link #this.resourceManager.define()} instead.
   * @deprecated
   */
  resource(options) {
    return this.resourceManager.define(options);
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link #this.resourceManager.registerActionHandlers()} instead.
   * @deprecated
   */
  actions(handlers, options) {
    return this.resourceManager.registerActionHandlers(handlers);
  }
  command(name, desc, opts) {
    return this.cli.command(name, desc, opts).allowUnknownOption();
  }
  findCommand(name) {
    return this.cli._findCommand(name);
  }
  async disposeServices() {
    if (this.redisConnectionManager) {
      await this.redisConnectionManager.close();
    }
    if (this.cacheManager) {
      await this.cacheManager.close();
    }
    if (this.pubSubManager) {
      await this.pubSubManager.close();
    }
    if (this.telemetry.started) {
      await this.telemetry.shutdown();
    }
    await this.workerIdAllocator.release();
  }
  /**
   * @internal
   */
  async reInit() {
    if (!this._loaded) {
      return;
    }
    this.log.info('app reinitializing');
    // trigger the stop events to make sure old instances are cleaned up
    await this.emitAsync('beforeStop');
    await this.emitAsync('afterStop');
    await this.disposeServices();
    this.closeLogger();
    const oldDb = this.db;
    this.init();
    if (!oldDb.closed()) {
      await oldDb.close();
    }
    this._loaded = false;
  }
  async createCacheManager() {
    this._cacheManager = await createCacheManager(this, {
      prefix: this.name,
      ...this.options.cacheManager,
    });
    return this._cacheManager;
  }
  async load(options) {
    if (this._loaded) {
      return;
    }
    if (options?.reload) {
      this.setMaintainingMessage('app reload');
      this.log.info(`app.reload()`, { method: 'load' });
      await this.disposeServices();
      const oldDb = this.db;
      this.init();
      if (!oldDb.closed()) {
        await oldDb.close();
      }
    }
    this._aesEncryptor = await AesEncryptor.create(this);
    if (this.cacheManager) {
      await this.cacheManager.close();
    }
    this._cacheManager = await this.createCacheManager();
    this.log.debug('init plugins');
    this.setMaintainingMessage('init plugins');
    await this.pm.initPlugins();
    this.log.debug('loading app...');
    this.setMaintainingMessage('start load');
    this.setMaintainingMessage('emit beforeLoad');
    if (options?.hooks !== false) {
      await this.emitAsync('beforeLoad', this, options);
    }
    if (!this._instanceId) {
      this._instanceId = await this.workerIdAllocator.getWorkerId();
      this.log.info(`allocate worker id: ${this._instanceId}`, { method: 'load' });
    }
    if (!this.snowflakeIdGenerator) {
      this.snowflakeIdGenerator = new Snowflake({
        workerId: this._instanceId,
      });
    }
    // Telemetry is initialized after beforeLoad hook
    // since some configuration may be registered in beforeLoad hook
    if (!this.telemetry.started) {
      this.telemetry.init();
      if (this.options.telemetry?.enabled) {
        // Start collecting telemetry data if enabled
        this.telemetry.start();
      }
    }
    await this.pm.load(options);
    if (options?.sync) {
      await this.db.sync();
    }
    this.setMaintainingMessage('emit afterLoad');
    if (options?.hooks !== false) {
      await this.emitAsync('afterLoad', this, options);
    }
    this._loaded = true;
  }
  async reload(options) {
    this.log.debug(`start reload`, { method: 'reload' });
    this._loaded = false;
    await this.emitAsync('beforeReload', this, options);
    await this.load({
      ...options,
      reload: true,
    });
    this.log.debug('emit afterReload', { method: 'reload' });
    this.setMaintainingMessage('emit afterReload');
    await this.emitAsync('afterReload', this, options);
    this.log.debug(`finish reload`, { method: 'reload' });
  }
  /**
   * This method is deprecated and should not be used.
   * Use {@link this.pm.get()} instead.
   * @deprecated
   */
  getPlugin(name) {
    return this.pm.get(name);
  }
  async authenticate() {
    if (this._authenticated) {
      return;
    }
    this._authenticated = true;
    await this.db.auth();
    await this.db.checkVersion();
    await this.db.prepare();
  }
  async runCommand(command, ...args) {
    return await this.runAsCLI([command, ...args], { from: 'user' });
  }
  async runCommandThrowError(command, ...args) {
    return await this.runAsCLI([command, ...args], { from: 'user', throwError: true });
  }
  /**
   * @internal
   */
  async loadMigrations(options) {
    const { directory, context, namespace } = options;
    const migrations = {
      beforeLoad: [],
      afterSync: [],
      afterLoad: [],
    };
    const extensions = ['js', 'ts'];
    const patten = `${directory}/*.{${extensions.join(',')}}`;
    const files = glob.sync(patten, {
      ignore: ['**/*.d.ts'],
    });
    const appVersion = await this.version.get();
    for (const file of files) {
      let filename = basename(file);
      filename = filename.substring(0, filename.lastIndexOf('.')) || filename;
      const Migration = await importModule(file);
      const m = new Migration({ app: this, db: this.db, ...context });
      if (!m.appVersion || semver.satisfies(appVersion, m.appVersion, { includePrerelease: true })) {
        m.name = `${filename}/${namespace}`;
        migrations[m.on || 'afterLoad'].push(m);
      }
    }
    return migrations;
  }
  /**
   * @internal
   */
  async loadCoreMigrations() {
    const migrations = await this.loadMigrations({
      directory: resolve(__dirname, 'migrations'),
      namespace: '@nocobase/server',
    });
    return {
      beforeLoad: {
        up: async () => {
          this.log.debug('run core migrations(beforeLoad)');
          const migrator = this.db.createMigrator({ migrations: migrations.beforeLoad });
          await migrator.up();
        },
      },
      afterSync: {
        up: async () => {
          this.log.debug('run core migrations(afterSync)');
          const migrator = this.db.createMigrator({ migrations: migrations.afterSync });
          await migrator.up();
        },
      },
      afterLoad: {
        up: async () => {
          this.log.debug('run core migrations(afterLoad)');
          const migrator = this.db.createMigrator({ migrations: migrations.afterLoad });
          await migrator.up();
        },
      },
    };
  }
  /**
   * @internal
   */
  async runAsCLI(argv = process.argv, options) {
    if (this.activatedCommand) {
      return;
    }
    if (options?.reqId) {
      this.context.reqId = options.reqId;
      this._logger = this._logger.child({ reqId: this.context.reqId });
    }
    this._maintainingStatusBeforeCommand = this._maintainingCommandStatus;
    try {
      const commandName = options?.from === 'user' ? argv[0] : argv[2];
      if (!this.cli.hasCommand(commandName)) {
        await this.pm.loadCommands();
      }
      const command = await this.cli.parseAsync(argv, options);
      await this.setMaintaining({
        status: 'command_end',
        command: this.activatedCommand,
      });
      return command;
    } catch (error) {
      if (!this.activatedCommand) {
        this.activatedCommand = {
          name: 'unknown',
        };
      }
      await this.setMaintaining({
        status: 'command_error',
        command: this.activatedCommand,
        error,
      });
      if (options?.throwError) {
        throw error;
      } else {
        this.log.error(error);
      }
    } finally {
      const _actionCommand = this._actionCommand;
      if (_actionCommand) {
        const options = _actionCommand['options'];
        _actionCommand['_optionValues'] = {};
        _actionCommand['_optionValueSources'] = {};
        _actionCommand['options'] = [];
        for (const option of options) {
          _actionCommand.addOption(option);
        }
      }
      this._actionCommand = null;
      this.activatedCommand = null;
    }
  }
  async start(options = {}) {
    if (this._started) {
      return;
    }
    this._started = new Date();
    if (options.checkInstall && !(await this.isInstalled())) {
      throw new ApplicationNotInstall(
        `Application ${this.name} is not installed, Please run 'yarn nocobase install' command first`,
      );
    }
    this.log.debug(`starting app...`);
    this.setMaintainingMessage('starting app...');
    if (this.db.closed()) {
      await this.db.reconnect();
    }
    this.setMaintainingMessage('emit beforeStart');
    await this.emitAsync('beforeStart', this, options);
    this.setMaintainingMessage('emit afterStart');
    await this.emitAsync('afterStart', this, options);
    await this.emitStartedEvent(options);
    this.stopped = false;
  }
  /**
   * @internal
   */
  async emitStartedEvent(options = {}) {
    await this.emitAsync('__started', this, {
      maintainingStatus: lodash.cloneDeep(this._maintainingCommandStatus),
      options,
    });
  }
  async isStarted() {
    return Boolean(this._started);
  }
  /**
   * @internal
   */
  async tryReloadOrRestart(options = {}) {
    if (this._started) {
      await this.restart(options);
    } else {
      await this.reload(options);
    }
  }
  async restart(options = {}) {
    if (!this._started) {
      return;
    }
    this.log.info('restarting...');
    this._started = null;
    await this.emitAsync('beforeStop');
    await this.reload(options);
    await this.start(options);
    this.emit('__restarted', this, options);
  }
  async stop(options = {}) {
    const log =
      options.logging === false
        ? {
            debug() {},
            warn() {},
            info() {},
            error() {},
          }
        : this.log;
    log.debug('stop app...', { method: 'stop' });
    this.setMaintainingMessage('stopping app...');
    if (this.stopped) {
      log.warn(`app is stopped`, { method: 'stop' });
      return;
    }
    await this.emitAsync('beforeStop', this, options);
    try {
      // close database connection
      // silent if database already closed
      if (!this.db.closed()) {
        log.info(`close db`, { method: 'stop' });
        await this.db.close();
      }
    } catch (e) {
      log.error(e.message, { method: 'stop', err: e.stack });
    }
    await this.disposeServices();
    await this.emitAsync('afterStop', this, options);
    this.emit('__stopped', this, options);
    this.stopped = true;
    log.info(`app has stopped`, { method: 'stop' });
    this._started = null;
  }
  async destroy(options = {}) {
    this.log.debug('start destroy app', { method: 'destory' });
    this.setMaintainingMessage('destroying app...');
    await this.emitAsync('beforeDestroy', this, options);
    await this.stop(options);
    this.log.debug('emit afterDestroy', { method: 'destory' });
    await this.emitAsync('afterDestroy', this, options);
    this.log.debug('finish destroy app', { method: 'destory' });
    this.closeLogger();
  }
  async isInstalled() {
    return (
      (await this.db.collectionExistsInDb('applicationVersion')) || (await this.db.collectionExistsInDb('collections'))
    );
  }
  async install(options = {}) {
    const reinstall = options.clean || options.force;
    if (reinstall) {
      await this.db.clean({ drop: true });
    }
    if (await this.isInstalled()) {
      this.log.warn('app is installed');
      return;
    }
    await this.reInit();
    await this.db.sync();
    await this.load({ hooks: false });
    this._loaded = false;
    this.log.debug('emit beforeInstall', { method: 'install' });
    this.setMaintainingMessage('call beforeInstall hook...');
    await this.emitAsync('beforeInstall', this, options);
    // await app.db.sync();
    await this.pm.install();
    await this.version.update();
    // this.setMaintainingMessage('installing app...');
    // this.log.debug('Database dialect: ' + this.db.sequelize.getDialect(), { method: 'install' });
    // if (options?.clean || options?.sync?.force) {
    //   this.log.debug('truncate database', { method: 'install' });
    //   await this.db.clean({ drop: true });
    //   this.log.debug('app reloading', { method: 'install' });
    //   await this.reload();
    // } else if (await this.isInstalled()) {
    //   this.log.warn('app is installed', { method: 'install' });
    //   return;
    // }
    // this.log.debug('start install plugins', { method: 'install' });
    // await this.pm.install(options);
    // this.log.debug('update version', { method: 'install' });
    // await this.version.update();
    this.log.debug('emit afterInstall', { method: 'install' });
    this.setMaintainingMessage('call afterInstall hook...');
    await this.emitAsync('afterInstall', this, options);
    if (this._maintainingStatusBeforeCommand?.error) {
      return;
    }
    if (this._started) {
      await this.restart();
    }
  }
  async upgrade(options = {}) {
    this.log.info('upgrading...');
    const pkgVersion = this.getPackageVersion();
    const appVersion = await this.version.get();
    if (process.env.SKIP_SAME_VERSION_UPGRADE === 'true' && pkgVersion === appVersion) {
      this.log.info(`app is already the latest version (${appVersion})`);
      return;
    }
    await this.reInit();
    const migrator1 = await this.loadCoreMigrations();
    await migrator1.beforeLoad.up();
    await this.db.sync();
    await migrator1.afterSync.up();
    await this.pm.initPresetPlugins();
    const migrator2 = await this.pm.loadPresetMigrations();
    await migrator2.beforeLoad.up();
    // load preset plugins
    await this.pm.load();
    await this.db.sync();
    await migrator2.afterSync.up();
    // upgrade preset plugins
    await this.pm.upgrade();
    await this.pm.initOtherPlugins();
    const migrator3 = await this.pm.loadOtherMigrations();
    await migrator3.beforeLoad.up();
    // load other plugins
    // TODO：改成约定式
    await this.load({ sync: true });
    // await this.db.sync();
    await migrator3.afterSync.up();
    // upgrade plugins
    await this.pm.upgrade();
    await migrator1.afterLoad.up();
    await migrator2.afterLoad.up();
    await migrator3.afterLoad.up();
    await this.pm.repository.updateVersions();
    await this.version.update();
    // await this.emitAsync('beforeUpgrade', this, options);
    // const force = false;
    // await measureExecutionTime(async () => {
    //   await this.db.migrator.up();
    // }, 'Migrator');
    // await measureExecutionTime(async () => {
    //   await this.db.sync({
    //     force,
    //     alter: {
    //       drop: force,
    //     },
    //   });
    // }, 'Sync');
    if (!options.quickstart) {
      await this.emitAsync('afterUpgrade', this, options);
    }
    await this.restart();
    // this.log.debug(chalk.green(`✨  NocoBase has been upgraded to v${this.getVersion()}`));
    // if (this._started) {
    //   await measureExecutionTime(async () => {
    //     await this.restart();
    //   }, 'Restart');
    // }
  }
  toJSON() {
    return {
      appName: this.name,
      name: this.name,
    };
  }
  /**
   * @internal
   */
  reInitEvents() {
    for (const eventName of this.eventNames()) {
      for (const listener of this.listeners(eventName)) {
        if (listener['_reinitializable']) {
          this.removeListener(eventName, listener);
        }
      }
    }
  }
  createLogger(options) {
    const { dirname } = options;
    return createLogger({
      ...options,
      dirname: getLoggerFilePath(path.join(this.name || 'main', dirname || '')),
    });
  }
  createCLI() {
    const command = new AppCommand('nocobase')
      .usage('[command] [options]')
      .hook('preAction', async (_, actionCommand) => {
        this._actionCommand = actionCommand;
        this.activatedCommand = {
          name: getCommandFullName(actionCommand),
        };
        await this.setMaintaining({
          status: 'command_begin',
          command: this.activatedCommand,
        });
        await this.setMaintaining({
          status: 'command_running',
          command: this.activatedCommand,
        });
        if (actionCommand['_authenticate']) {
          await this.authenticate();
        }
        if (actionCommand['_preload']) {
          await this.load();
        }
      })
      .hook('postAction', async (_, actionCommand) => {
        if (this._maintainingStatusBeforeCommand?.error && this._started) {
          await this.restart();
        }
      });
    command.exitOverride((err) => {
      throw err;
    });
    return command;
  }
  initLogger(options) {
    this._logger = createSystemLogger({
      dirname: getLoggerFilePath(this.name),
      filename: 'system',
      seperateError: true,
      ...(options?.system || {}),
    }).child({
      reqId: this.context.reqId,
      app: this.name,
      module: 'application',
      // Due to the use of custom log levels,
      // we have to use any type here until Winston updates the type definitions.
    });
    this.requestLogger = createLogger({
      dirname: getLoggerFilePath(this.name),
      filename: 'request',
      ...(options?.request || {}),
    });
    this._sqlLogger = this.createLogger({
      filename: 'sql',
      level: 'debug',
    });
  }
  closeLogger() {
    this.log?.close();
    this.requestLogger?.close();
    this._sqlLogger?.close();
  }
  init() {
    const options = this.options;
    this._instanceId = options.instanceId;
    this.initLogger(options.logger);
    this.reInitEvents();
    this.middleware = new Toposort();
    this.plugins = new Map();
    if (this.db) {
      this.db.removeAllListeners();
    }
    this.createMainDataSource(options);
    this.redisConnectionManager = new RedisConnectionManager({
      redisConfig: options.redisConfig,
      logger: this._logger.child({ module: 'redis-connection-manager' }),
    });
    this.workerIdAllocator = new WorkerIdAllocator();
    this._cronJobManager = new CronJobManager(this);
    this._env = new Environment();
    this._cli = this.createCLI();
    this._i18n = createI18n(options);
    this.aiManager = new AIManager(this);
    this.pubSubManager = createPubSubManager(this, options.pubSubManager);
    this.syncMessageManager = new SyncMessageManager(this, options.syncMessageManager);
    this.eventQueue = new EventQueue(this, options.eventQueue);
    this.lockManager = new LockManager({
      defaultAdapter: process.env.LOCK_ADAPTER_DEFAULT,
      ...options.lockManager,
    });
    this.context.db = this.db;
    /**
     * This method is deprecated and should not be used.
     * Use {@link #this.context.resourceManager} instead.
     * @deprecated
     */
    this.context.resourcer = this.resourceManager;
    this.context.resourceManager = this.resourceManager;
    this.context.cacheManager = this._cacheManager;
    this.context.cache = this._cache;
    const plugins = this._pm ? this._pm.options.plugins : options.plugins;
    this._pm = new PluginManager({
      app: this,
      plugins: plugins || [],
    });
    this._telemetry = new Telemetry({
      appName: this.name,
      version: this.getPackageVersion(),
      ...options.telemetry,
    });
    this._authManager = new AuthManager({
      authKey: 'X-Authenticator',
      default: 'basic',
      ...(this.options.authManager || {}),
    });
    this._auditManager = new AuditManager();
    this.resourceManager.define({
      name: 'auth',
      actions: authActions,
    });
    this._dataSourceManager.beforeAddDataSource((dataSource) => {
      if (dataSource.collectionManager instanceof SequelizeCollectionManager) {
        setupSnowflakeIdField(this, dataSource.collectionManager.db);
      }
    });
    this._dataSourceManager.afterAddDataSource((dataSource) => {
      if (dataSource.collectionManager instanceof SequelizeCollectionManager) {
        for (const [actionName, actionParams] of Object.entries(availableActions)) {
          dataSource.acl.setAvailableAction(actionName, actionParams);
        }
      }
    });
    this._dataSourceManager.use(this._authManager.middleware(), { tag: 'auth', before: 'default' });
    this._dataSourceManager.use(validateFilterParams, { tag: 'validate-filter-params', before: ['auth'] });
    this._dataSourceManager.use(parseVariables, {
      group: 'parseVariables',
      after: 'acl',
    });
    this._dataSourceManager.use(dataTemplate, { group: 'dataTemplate', after: 'acl' });
    this._locales = new Locale(createAppProxy(this));
    if (options.perfHooks) {
      enablePerfHooks(this);
    }
    registerMiddlewares(this, options);
    if (options.registerActions !== false) {
      registerActions(this);
    }
    registerCli(this);
    this._version = new ApplicationVersion(this);
    for (const callback of Application.staticCommands) {
      callback(this);
    }
    this.aiManager = new AIManager(this);
  }
  createMainDataSource(options) {
    const mainDataSourceInstance = new MainDataSource({
      name: 'main',
      database: this.createDatabase(options),
      acl: createACL(),
      resourceManager: createResourcer(options),
      useACL: options.acl,
    });
    this._dataSourceManager = new DataSourceManager({
      logger: this.logger,
      app: this,
    });
    // can not use await here
    this.dataSourceManager.dataSources.set('main', mainDataSourceInstance);
  }
  createDatabase(options) {
    const logging = (...args) => {
      let msg = args[0];
      if (typeof msg === 'string') {
        msg = msg.replace(/[\r\n]/gm, '').replace(/\s+/g, ' ');
      }
      if (msg.includes('INSERT INTO')) {
        msg = msg.substring(0, 2000) + '...';
      }
      const content = { message: msg, app: this.name, reqId: this.context.reqId };
      if (args[1] && typeof args[1] === 'number') {
        content.executeTime = args[1];
      }
      this._sqlLogger.debug(content);
    };
    const dbOptions = options.database instanceof Database ? options.database.options : options.database;
    const db = new Database({
      ...dbOptions,
      logging: dbOptions.logging ? logging : false,
      migrator: {
        context: { app: this },
      },
      logger: this._logger.child({ module: 'database' }),
    });
    // NOTE: to avoid listener number warning (default to 10)
    // See: https://nodejs.org/api/events.html#emittersetmaxlistenersn
    db.setMaxListeners(100);
    return db;
  }
}
applyMixins(Application, [AsyncEmitter]);
export default Application;
//# sourceMappingURL=application.js.map
