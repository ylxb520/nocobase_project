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

  // 检查工作流的创建和更新时间
  const workflows = await client.query(`
    SELECT id, title, type, enabled, "createdAt", "updatedAt"
    FROM workflows
    ORDER BY "updatedAt" DESC
  `);
  console.log('=== 工作流时间 ===');
  workflows.rows.forEach((w) => {
    console.log(`${w.title} (${w.type})`);
    console.log(`  启用: ${w.enabled}`);
    console.log(`  创建: ${w.createdAt}`);
    console.log(`  更新: ${w.updatedAt}`);
  });

  // 检查 material_submissions 的最新更新时间
  const data = await client.query(`
    SELECT id, "updatedAt"
    FROM material_submissions
    ORDER BY "updatedAt" DESC
    LIMIT 3
  `);
  console.log('\n=== 数据更新时间 ===');
  data.rows.forEach((d) => {
    console.log(`ID: ${d.id}, 更新时间: ${d.updatedAt}`);
  });

  // 检查操作后事件工作流是否存在问题
  const actionWf = await client.query(`
    SELECT id, title, config, "createdAt", "updatedAt"
    FROM workflows
    WHERE type = 'action'
  `);
  console.log('\n=== 操作后事件工作流详情 ===');
  actionWf.rows.forEach((w) => {
    console.log(`创建时间: ${w.createdAt}`);
    console.log(`更新时间: ${w.updatedAt}`);
    console.log(`配置: ${JSON.stringify(w.config, null, 2)}`);
  });

  await client.end();
}

main().catch(console.error);
