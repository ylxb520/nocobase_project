/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { loadMariadbDriver, loadMysqlDriver, loadPgModule } from './db-drivers';
async function createMySQLDatabase({ host, port, username, password, database, driver, }) {
    const conn = await driver.createConnection({
        host,
        port,
        user: username,
        password,
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await (conn.end?.() ?? conn.close());
}
async function withPgClient(options, fn) {
    const { Client } = loadPgModule();
    const client = new Client(options);
    await client.connect();
    try {
        await fn(client);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        await client.end();
    }
}
export const createDatabaseCondition = ({ appOptions }) => !appOptions?.dbConnType || appOptions.dbConnType === 'new_database';
export const createConnectionCondition = ({ appOptions }) => appOptions?.dbConnType === 'new_connection';
export const createSchemaCondition = ({ appOptions }) => appOptions.dbConnType === 'new_schema';
export const createDatabase = async ({ app }) => {
    const { host, port, username, password, dialect, database } = app.options.database;
    if (dialect === 'mysql') {
        const mysql = loadMysqlDriver();
        return createMySQLDatabase({
            host,
            port,
            username,
            password,
            database,
            driver: mysql,
        });
    }
    if (dialect === 'mariadb') {
        const mariadb = loadMariadbDriver();
        return createMySQLDatabase({
            host,
            port,
            username,
            password,
            database,
            driver: mariadb,
        });
    }
    if (['postgres', 'kingbase'].includes(dialect)) {
        return withPgClient({ host, port, user: username, password, database: dialect }, async (client) => {
            const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
            if (exists.rowCount === 0) {
                await client.query(`CREATE DATABASE "${database}"`);
            }
        });
    }
};
export const createConnection = async ({ app }) => {
    const { host, port, username, password, dialect, database, schema } = app.options.database;
    if (dialect === 'mysql') {
        const mysql = loadMysqlDriver();
        return createMySQLDatabase({
            host,
            port,
            username,
            password,
            database,
            driver: mysql,
        });
    }
    if (dialect === 'mariadb') {
        const mariadb = loadMariadbDriver();
        return createMySQLDatabase({
            host,
            port,
            username,
            password,
            database,
            driver: mariadb,
        });
    }
    if (['postgres', 'kingbase'].includes(dialect)) {
        if (schema) {
            return withPgClient({ host, port, user: username, password, database }, (client) => client.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`));
        }
        else {
            return withPgClient({ host, port, user: username, password, database: dialect }, (client) => client.query(`CREATE DATABASE "${database}"`));
        }
    }
};
export const createSchema = async ({ app }) => {
    const { host, port, username, password, dialect, schema, database } = app.options.database;
    if (!['postgres', 'kingbase'].includes(dialect)) {
        throw new Error('Schema is only supported for postgres/kingbase');
    }
    return withPgClient({ host, port, user: username, password, database }, (client) => client.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`));
};
//# sourceMappingURL=db-creator.js.map