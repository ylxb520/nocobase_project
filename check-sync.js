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

  // 1. 查询 collections 表中 material_submissions 的字段定义
  const collection = await client.query(`
    SELECT name, fields
    FROM collections
    WHERE name = 'material_submissions'
  `);

  if (collection.rows.length > 0) {
    console.log('=== NocoBase collections 表中定义的字段 ===');
    const fields = collection.rows[0].fields;
    const fieldNames = fields.map((f) => f.name).sort();
    console.log('字段列表:', fieldNames.join(', '));

    // 检查是否有 Auto_fill
    const autoFillField = fields.find((f) => f.name === 'Auto_fill');
    if (autoFillField) {
      console.log('\n=== Auto_fill 字段详情 ===');
      console.log(JSON.stringify(autoFillField, null, 2));
    } else {
      console.log('\n未找到 Auto_fill 字段!');
    }
  }

  // 2. 查询数据库实际的列
  const dbColumns = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'material_submissions'
    ORDER BY column_name
  `);
  console.log('\n=== 数据库实际的列 ===');
  const dbColNames = dbColumns.rows.map((r) => r.column_name).sort();
  console.log('列列表:', dbColNames.join(', '));

  // 3. 检查是否有 Auto_fill 相关的表（关联表）
  const autoTables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name ILIKE '%auto_fill%'
  `);
  console.log('\n=== Auto_fill 相关表 ===');
  console.log(JSON.stringify(autoTables.rows, null, 2));

  await client.end();
}

main().catch(console.error);
