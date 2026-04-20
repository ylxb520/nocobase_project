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

  // 1. 检查工作流完整配置
  console.log('=== 1. 工作流完整配置 ===');
  const wf = await client.query(`
    SELECT * FROM workflows WHERE type = 'action'
  `);
  console.log(JSON.stringify(wf.rows, null, 2));

  // 2. 检查工作流节点
  console.log('\n=== 2. 工作流节点 ===');
  const nodes = await client.query(`
    SELECT id, type, title, "workflowId"
    FROM flow_nodes
    WHERE "workflowId" IN (SELECT id FROM workflows WHERE type = 'action')
  `);
  console.log(JSON.stringify(nodes.rows, null, 2));

  // 3. 检查数据源
  console.log('\n=== 3. 数据源配置 ===');
  const ds = await client.query(`
    SELECT name, "collectionName" FROM fields WHERE "collectionName" = 'material_submissions' LIMIT 5
  `);
  console.log('material_submissions 前5个字段:');
  ds.rows.forEach((f) => console.log(`  - ${f.name}`));

  // 4. 检查 Auto_fill 字段定义
  console.log('\n=== 4. Auto_fill 字段定义 ===');
  const autoFillField = await client.query(`
    SELECT * FROM fields WHERE name = 'Auto_fill' AND "collectionName" = 'material_submissions'
  `);
  console.log(JSON.stringify(autoFillField.rows, null, 2));

  // 5. 检查中间表
  console.log('\n=== 5. 中间表数据 ===');
  const through = await client.query(`
    SELECT COUNT(*) as count FROM t_xdz9l7phr8b
  `);
  console.log(`中间表记录数: ${through.rows[0].count}`);

  // 6. 检查 material_submissions 的 updatedAt
  console.log('\n=== 6. material_submissions 更新时间 ===');
  const ms = await client.query(`
    SELECT id, "updatedAt" FROM material_submissions ORDER BY "updatedAt" DESC LIMIT 1
  `);
  console.log(JSON.stringify(ms.rows, null, 2));

  // 7. 检查执行记录
  console.log('\n=== 7. 执行记录 ===');
  const exec = await client.query(`
    SELECT COUNT(*) as count FROM executions
  `);
  console.log(`执行记录数: ${exec.rows[0].count}`);

  // 8. 检查项目是否正在运行
  console.log('\n=== 8. 当前时间 ===');
  console.log(new Date().toISOString());

  await client.end();
}

main().catch(console.error);
