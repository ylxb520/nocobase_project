const { Client } = require('pg');
const { execSync } = require('child_process');

async function migrateManually() {
  console.log('=== 开始手动迁移数据库 ===\n');

  // 1. 连接到 postgres 数据库
  const pgClient = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'postgres',
  });

  try {
    await pgClient.connect();

    // 2. 断开所有连接到 nocobase 的连接
    console.log('步骤1: 断开所有 nocobase 数据库连接...');
    await pgClient.query(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE datname = 'nocobase' AND pid <> pg_backend_pid()
    `);

    // 3. 删除 nocobase 数据库
    console.log('步骤2: 删除 nocobase 数据库...');
    await pgClient.query('DROP DATABASE IF EXISTS nocobase');

    // 4. 创建 nocobase 数据库
    console.log('步骤3: 创建 nocobase 数据库...');
    await pgClient.query('CREATE DATABASE nocobase');

    await pgClient.end();

    // 5. 使用 pg_dump 和 psql 进行迁移
    console.log('步骤4: 执行 pg_dump | psql 迁移...');

    const env = { ...process.env, PGPASSWORD: '123456' };

    // 先导出到临时文件
    const dumpFile = 'd:/big-model2/temp_dump.sql';

    console.log('  - 导出 big-model 数据库...');
    execSync(
      `"D:\\class\\postgresql\\bin\\pg_dump.exe" -h localhost -p 5433 -U postgres -d big-model -F p -f "${dumpFile}"`,
      { env, stdio: 'inherit' },
    );

    console.log('  - 导入到 nocobase 数据库...');
    execSync(`"D:\\class\\postgresql\\bin\\psql.exe" -h localhost -p 5433 -U postgres -d nocobase -f "${dumpFile}"`, {
      env,
      stdio: 'inherit',
    });

    console.log('\n=== 迁移完成！===\n');

    // 清理临时文件
    const fs = require('fs');
    fs.unlinkSync(dumpFile);
  } catch (error) {
    console.error('迁移错误:', error.message);
  }
}

migrateManually();
