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

  // 查询其他工作流的 collection 格式
  const workflows = await client.query(`
    SELECT id, title, type, config->>'collection' as collection
    FROM workflows
    WHERE config->>'collection' IS NOT NULL
  `);
  console.log('=== 工作流 collection 配置格式 ===');
  workflows.rows.forEach((w) => {
    console.log(`${w.title} (${w.type}): ${w.collection}`);
  });

  // 检查操作后事件的完整配置
  const actionWf = await client.query(`
    SELECT id, title, config
    FROM workflows
    WHERE type = 'action'
  `);
  console.log('\n=== 操作后事件完整配置 ===');
  console.log(JSON.stringify(actionWf.rows, null, 2));

  await client.end();
}

main().catch(console.error);
