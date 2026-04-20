const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'nocobase',
  user: 'postgres',
  password: '123456',
});

async function main() {
  await client.connect();

  // 查找插件相关的表
  const tables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name ILIKE '%plugin%'
  `);
  console.log('=== 插件相关的表 ===');
  console.log(JSON.stringify(tables.rows, null, 2));

  // 检查 applicationPlugins 表
  const plugins = await client.query(`
    SELECT name
    FROM "applicationPlugins"
    WHERE enabled = true
    ORDER BY name
  `);
  console.log('\n=== 已启用的插件 ===');
  plugins.rows.forEach((p) => console.log(p.name));

  await client.end();
}

main().catch(console.error);
