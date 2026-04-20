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

  // 检查已安装的插件
  const plugins = await client.query(`
    SELECT name
    FROM plugins
    WHERE enabled = true
    ORDER BY name
  `);
  console.log('=== 已启用的插件 ===');
  plugins.rows.forEach((p) => console.log(p.name));

  await client.end();
}

main().catch(console.error);
