const { Client } = require('pg');

async function checkConnections() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'postgres',
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT pid, usename, application_name, client_addr, state, query_start, query
      FROM pg_stat_activity 
      WHERE datname = 'nocobase'
      ORDER BY query_start DESC
    `);

    console.log('=== 连接到 nocobase 数据库的活跃连接 ===\n');
    result.rows.forEach((row, i) => {
      console.log(`${i + 1}. PID: ${row.pid}, 用户: ${row.usename}, 应用: ${row.application_name || 'N/A'}`);
      console.log(`   状态: ${row.state}, 查询: ${(row.query || '').substring(0, 80)}...`);
      console.log('');
    });

    console.log(`总计: ${result.rows.length} 个连接`);
  } catch (e) {
    console.error('错误:', e.message);
  } finally {
    await client.end();
  }
}

checkConnections();
