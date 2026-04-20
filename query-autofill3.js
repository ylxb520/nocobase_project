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

  // 查询 material_submissions 的 collection 定义
  const collection = await client.query(`
    SELECT name, "fields"
    FROM collections
    WHERE name = 'material_submissions'
  `);
  console.log('=== material_submissions collection 定义 ===');

  if (collection.rows.length > 0) {
    const fields = collection.rows[0].fields;
    // 查找 Auto_fill 相关字段
    const autoFillFields = fields.filter(f =>
      f.name && f.name.toLowerCase().includes('auto')
    );
    console.log('Auto 相关字段:');
    console.log(JSON.stringify(autoFillFields, null, 2));
  }

  // 查询是否有 Auto_fill 相关的表
  const autoTables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name ILIKE '%auto%'
  `);
  console.log('\n=== Auto 相关的数据库表 ===');
  console.log(JSON.stringify(autoTables.rows, null, 2));

  // 查询是否有 Auto_fill 相关的 collection
  const autoCollections = await client.query(`
    SELECT name
    FROM collections
    WHERE name ILIKE '%auto%'
  `);
  console.log('\n=== Auto 相关的 collection ===');
  console.log(JSON.stringify(autoCollections.rows, null, 2));

  await client.end();
}

main().catch(console.error);
