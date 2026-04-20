/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createConnection,
  createConnectionCondition,
  createDatabase,
  createDatabaseCondition,
  createSchema,
  createSchemaCondition,
} from '../../app-supervisor/db-creator';
import { AppSupervisor } from '../../app-supervisor';
const mysqlModule = { createConnection: vi.fn() };
const mariadbModule = { createConnection: vi.fn() };
const pgClientInstances = [];
const createPgClient = () => {
  const instance = {
    connect: vi.fn().mockResolvedValue(undefined),
    query: vi.fn().mockResolvedValue(undefined),
    end: vi.fn().mockResolvedValue(undefined),
  };
  pgClientInstances.push(instance);
  return instance;
};
const pgModule = {
  Client: vi.fn(() => createPgClient()),
};
vi.mock('../../app-supervisor/db-drivers', () => ({
  loadMysqlDriver: () => mysqlModule,
  loadMariadbDriver: () => mariadbModule,
  loadPgModule: () => pgModule,
}));
const createApp = (databaseOverrides = {}) => ({
  options: {
    database: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'secret',
      dialect: 'mysql',
      database: 'db_test',
      schema: 'public',
      ...databaseOverrides,
    },
  },
});
describe('app supervisor db creator predicates', () => {
  beforeEach(() => {
    delete process.env.USE_DB_SCHEMA_IN_SUBAPP;
  });
  it('detects when a new database should be created', () => {
    expect(createDatabaseCondition({ appOptions: {} })).toBe(true);
    expect(createDatabaseCondition({ appOptions: { dbConnType: 'new_database' } })).toBe(true);
    expect(createDatabaseCondition({ appOptions: { dbConnType: 'new_connection' } })).toBe(false);
  });
  it('detects when a new connection should be created', () => {
    expect(createConnectionCondition({ appOptions: { dbConnType: 'new_connection' } })).toBe(true);
    expect(createConnectionCondition({ appOptions: {} })).toBe(false);
  });
  it('detects when a schema should be created', () => {
    expect(createSchemaCondition({ appOptions: { dbConnType: 'new_schema' } })).toBe(true);
    expect(createSchemaCondition({ appOptions: { dbConnType: 'custom' } })).toBe(false);
  });
});
describe('database creators', () => {
  beforeEach(() => {
    mysqlModule.createConnection = vi.fn();
    mariadbModule.createConnection = vi.fn();
    pgClientInstances.length = 0;
    pgModule.Client.mockImplementation(() => createPgClient());
  });
  afterEach(() => {
    delete process.env.USE_DB_SCHEMA_IN_SUBAPP;
  });
  it('creates mysql databases', async () => {
    const connection = {
      query: vi.fn().mockResolvedValue(undefined),
      end: vi.fn().mockResolvedValue(undefined),
    };
    mysqlModule.createConnection.mockResolvedValue(connection);
    await createDatabase({ app: createApp({ dialect: 'mysql', database: 'tenant' }) });
    expect(mysqlModule.createConnection).toHaveBeenCalledWith({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'secret',
    });
    expect(connection.query).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `tenant`');
    expect(connection.end).toHaveBeenCalled();
  });
  it('creates mariadb databases falling back to close()', async () => {
    const connection = {
      query: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
    };
    mariadbModule.createConnection.mockResolvedValue(connection);
    await createDatabase({ app: createApp({ dialect: 'mariadb', database: 'tenant' }) });
    expect(mariadbModule.createConnection).toHaveBeenCalledWith({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'secret',
    });
    expect(connection.query).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `tenant`');
    expect(connection.close).toHaveBeenCalled();
  });
  it('creates postgres databases through pg client', async () => {
    const app = createApp({ dialect: 'postgres', database: 'tenant', username: 'pg', port: 5432 });
    await createDatabase({ app });
    expect(pgModule.Client).toHaveBeenCalledWith({
      host: 'localhost',
      port: 5432,
      user: 'pg',
      password: 'secret',
      database: 'postgres',
    });
    expect(pgClientInstances[0].query).toHaveBeenCalledWith('SELECT 1 FROM pg_database WHERE datname = $1', ['tenant']);
    expect(pgClientInstances[0].end).toHaveBeenCalled();
  });
  it('creates mysql connections the same way as databases', async () => {
    const connection = {
      query: vi.fn().mockResolvedValue(undefined),
      end: vi.fn().mockResolvedValue(undefined),
    };
    mysqlModule.createConnection.mockResolvedValue(connection);
    await createConnection({ app: createApp({ dialect: 'mysql', database: 'tenant_conn' }) });
    expect(mysqlModule.createConnection).toHaveBeenCalled();
    expect(connection.query).toHaveBeenCalledWith('CREATE DATABASE IF NOT EXISTS `tenant_conn`');
  });
  it('creates postgres schema when schema is provided', async () => {
    const app = createApp({ dialect: 'kingbase', schema: 'custom_schema', port: 5433 });
    await createConnection({ app });
    expect(pgModule.Client).toHaveBeenCalledWith({
      host: 'localhost',
      port: 5433,
      user: 'root',
      password: 'secret',
      database: 'db_test',
    });
    expect(pgClientInstances[0].query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS custom_schema');
  });
  it('creates postgres database when schema is missing', async () => {
    const app = createApp({ dialect: 'postgres', database: 'new_conn', schema: null });
    await createConnection({ app });
    expect(pgClientInstances[0].query).toHaveBeenCalledWith('CREATE DATABASE "new_conn"');
  });
  it('only allows schema creation for postgres-like dialects', async () => {
    await expect(createSchema({ app: createApp({ dialect: 'mysql' }) })).rejects.toThrow(
      'Schema is only supported for postgres/kingbase',
    );
  });
  it('creates schemas with pg client', async () => {
    const app = createApp({ dialect: 'postgres', schema: 'analytics', port: 5432 });
    await createSchema({ app });
    expect(pgClientInstances[0].query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS analytics');
    expect(pgClientInstances[0].end).toHaveBeenCalled();
  });
});
describe('AppSupervisor registerAppDbCreator', () => {
  it('registers custom db creators and dispatches them according to conditions', async () => {
    const supervisor = AppSupervisor.getInstance();
    const customCreator = vi.fn().mockResolvedValue(undefined);
    AppSupervisor.getInstance().registerAppDbCreator(
      ({ appOptions }) => appOptions.dbConnType === 'custom',
      customCreator,
    );
    const ctx = {
      app: createApp(),
      appOptions: { dbConnType: 'custom' },
    };
    await supervisor.createDatabase(ctx);
    expect(customCreator).toHaveBeenCalledWith(ctx);
  });
});
//# sourceMappingURL=db-creator.test.js.map
