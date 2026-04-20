const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'nocobase',
  user: 'postgres',
  password: '123456'
});

async function main() {
  await client.connect();

  // 查询所有工作流
  const workflows = await client.query(`
    SELECT id, title, enabled, type, config
    FROM workflows
    ORDER BY "updatedAt" DESC
  `);
  console.log('=== 所有工作流 ===');
  workflows.rows.forEach(w => {
    console.log(`\nID: ${w.id}`);
    console.log(`标题: ${w.title}`);
    console.log(`类型: ${w.type}`);
    console.log(`启用: ${w.enabled}`);
    console.log(`配置: ${JSON.stringify(w.config, null, 2)}`);
  });

  // 查询最近的执行记录
  const executions = await client.query(`
    SELECT id, "workflowId", status, "createdAt"
    FROM executions
    ORDER BY "createdAt" DESC
    LIMIT 5
  `);
  console.log('\n=== 最近执行记录 ===');
  console.log(JSON.stringify(executions.rows, null, 2));

  await client.end();
}

main().catch(console.error);
