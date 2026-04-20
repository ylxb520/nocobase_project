/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import http from 'http';
import url from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class DBManager {
  acquiredDBs = new Map();
  acquire(name, via) {
    console.log('acquire', name, 'via', via);
    if (this.acquiredDBs.has(name)) {
      // If DB is already acquired, add the via to the set
      this.acquiredDBs.get(name).add(via);
    } else {
      // If DB is not acquired yet, set the set with the via
      this.acquiredDBs.set(name, new Set([via]));
    }
  }
  async release(name, via, relaseDb) {
    console.log('release', name, 'via', via);
    const vias = this.acquiredDBs.get(name);
    if (!vias || !vias.has(via)) {
      console.log(`Cannot release ${name}, it is not acquired via ${via}`);
      return;
    }
    // Remove the via from the set
    vias.delete(via);
    // If no more vias, remove the DB from the map
    if (vias.size === 0) {
      console.log('DB', name, 'is not used anymore, release it');
      // delay 1000ms to make sure the DB is not used anymore
      await delay(1000);
      if (this.acquiredDBs.get(name)?.size === 0) {
        console.log('start to release DB', name);
        await relaseDb?.();
        this.acquiredDBs.delete(name);
        console.log('DB', name, 'is released, current usesd db count:', this.acquiredDBs.size);
      }
    }
    return null;
  }
  isAcquired(name) {
    return this.acquiredDBs.has(name);
  }
}
const getDBNames = (size, name) => {
  const names = [];
  for (let i = 0; i < size; i++) {
    names.push(`auto_named_${name}_${i}`);
  }
  return names;
};
class BasePool {
  size;
  dbManager = new DBManager();
  constructor(size) {
    this.size = size;
  }
  async init() {
    const promises = [];
    for (const name of getDBNames(this.size, this.getConfiguredDatabaseName())) {
      promises.push(
        (async () => {
          console.log('create database', name);
          await this.createDatabase(name);
        })(),
      );
    }
    await Promise.all(promises);
  }
  async acquire(name, via) {
    if (!name) {
      name = getDBNames(this.size, this.getConfiguredDatabaseName()).find((name) => !this.dbManager.isAcquired(name));
    }
    if (!name) {
      throw new Error('No available database');
    }
    this.dbManager.acquire(name, via);
    return name;
  }
  async release(name, via) {
    await this.dbManager.release(name, via, async () => {
      await this.cleanDatabase(name);
    });
  }
}
class PostgresPool extends BasePool {
  async _createConnection(options, callback) {
    const config = this.getDatabaseConfiguration();
    const databaseName = this.getConfiguredDatabaseName();
    const client = new pg.Client({
      host: config['host'],
      port: config['port'],
      user: config['username'],
      password: config['password'],
      database: databaseName,
      ...options,
    });
    await client.connect();
    await callback(client);
    await client.end();
  }
  async cleanDatabase(name) {
    await this._createConnection({ database: name }, async (client) => {
      await client.query(`DROP SCHEMA public CASCADE;CREATE SCHEMA public;`);
    });
  }
  async createDatabase(name, options) {
    const { log } = options || {};
    await this._createConnection({}, async (client) => {
      if (log) {
        console.log(`DROP DATABASE IF EXISTS ${name}`);
      }
      await client.query(`DROP DATABASE IF EXISTS ${name}`);
      if (log) {
        console.log(`CREATE DATABASE ${name}`);
      }
      await client.query(`CREATE DATABASE ${name}`);
      if (log) {
        console.log(`end`);
      }
    });
  }
  getDatabaseConfiguration() {
    return {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    };
  }
  getConfiguredDatabaseName() {
    return process.env.DB_DATABASE;
  }
}
class SqlitePool extends BasePool {
  async createDatabase(name, options) {
    return fs.promises.writeFile(path.resolve(this.getStoragePath(), name), '');
  }
  async cleanDatabase(name) {
    return fs.promises.unlink(path.resolve(this.getStoragePath(), name));
  }
  getDatabaseConfiguration() {
    return {
      storage: process.env.DB_STORAGE,
    };
  }
  getConfiguredDatabaseName() {
    const storagePath = process.env.DB_STORAGE;
    if (storagePath && storagePath !== ':memory:') {
      return path.basename(storagePath);
    }
  }
  getStoragePath() {
    const storagePath = process.env.DB_STORAGE;
    if (storagePath && storagePath !== ':memory:') {
      // return path without file name
      return path.dirname(storagePath);
    }
  }
}
const pools = {
  postgres: PostgresPool,
  sqlite: SqlitePool,
};
(async () => {
  const poolSize = process.env.TEST_DB_POOL_SIZE || 100;
  const poolClass = pools[process.env.DB_DIALECT];
  if (!poolClass) {
    throw new Error(`Unknown pool class ${process.env.DB_DIALECT}`);
  }
  const pool = new poolClass(poolSize);
  await pool.init();
  return pool;
})()
  .then((pool) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const path = parsedUrl.pathname;
      const trimmedPath = path.replace(/^\/+|\/+$/g, '');
      if (trimmedPath === 'acquire') {
        const via = parsedUrl.query.via;
        const name = parsedUrl.query.name;
        pool
          .acquire(name, via)
          .then((name) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ name }));
          })
          .catch((err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          });
      } else if (trimmedPath === 'release') {
        const via = parsedUrl.query.via;
        const name = parsedUrl.query.name;
        pool.release(name, via);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
      }
    });
    server.listen(23450, '127.0.0.1', () => {
      console.log('Server is running at http://127.0.0.1:23450/');
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
//# sourceMappingURL=test-db-distributor.js.map
