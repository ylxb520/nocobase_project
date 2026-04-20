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

  // 检查 material_submissions 表的最新数据
  const data = await client.query(`
    SELECT id, "createdAt", "updatedAt", status
    FROM material_submissions
    ORDER BY "updatedAt" DESC
    LIMIT 5
  `);
  console.log('=== material_submissions 最新数据 ===');
  console.log(JSON.stringify(data.rows, null, 2));

  // 检查是否有 audit logs
  const auditLogs = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name ILIKE '%audit%' OR table_name ILIKE '%log%'
  `);
  console.log('\n=== 审计日志相关表 ===');
  console.log(JSON.stringify(auditLogs.rows, null, 2));

  // 检查 action_logs 表
  const actionLogs = await client
    .query(
      `
    SELECT *
    FROM action_logs
    WHERE "collectionName" = 'material_submissions'
    ORDER BY "createdAt" DESC
    LIMIT 5
  `,
    )
    .catch(() => ({ rows: [] }));
  console.log('\n=== action_logs 记录 ===');
  console.log(JSON.stringify(actionLogs.rows, null, 2));

  await client.end();
}

main().catch(console.error);
