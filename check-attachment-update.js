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

  // 检查中间表（附件关联表）的最新数据
  const through = await client.query(`
    SELECT *
    FROM t_xdz9l7phr8b
    ORDER BY f_n3prmobf9nv DESC
    LIMIT 5
  `);
  console.log('=== 附件关联中间表 ===');
  console.log(JSON.stringify(through.rows, null, 2));

  // 检查 attachments 表的最新附件
  const attachments = await client.query(`
    SELECT id, filename, url, "createdAt"
    FROM attachments
    ORDER BY "createdAt" DESC
    LIMIT 5
  `);
  console.log('\n=== 最新附件 ===');
  console.log(JSON.stringify(attachments.rows, null, 2));

  // 检查最近的执行记录
  const executions = await client.query(`
    SELECT id, "workflowId", status, "createdAt"
    FROM executions
    ORDER BY "createdAt" DESC
    LIMIT 5
  `);
  console.log('\n=== 执行记录 ===');
  console.log(JSON.stringify(executions.rows, null, 2));

  await client.end();
}

main().catch(console.error);
