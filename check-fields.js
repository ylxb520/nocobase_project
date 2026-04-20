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

  // 查找字段相关的表
  const fieldTables = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name ILIKE '%field%'
  `);
  console.log('=== 字段相关的表 ===');
  console.log(JSON.stringify(fieldTables.rows, null, 2));

  // 查看 fields 表结构
  const fieldsCols = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'fields'
  `);
  console.log('\n=== fields 表结构 ===');
  console.log(JSON.stringify(fieldsCols.rows, null, 2));

  // 查询 material_submissions 的字段
  const msFields = await client.query(`
    SELECT name, type, "collectionName"
    FROM fields
    WHERE "collectionName" = 'material_submissions'
    ORDER BY name
  `);
  console.log('\n=== material_submissions 的字段 ===');
  msFields.rows.forEach((f) => console.log(`${f.name} (${f.type})`));

  // 查找 Auto_fill 字段
  const autoFillField = await client.query(`
    SELECT *
    FROM fields
    WHERE "collectionName" = 'material_submissions'
    AND name = 'Auto_fill'
  `);
  console.log('\n=== Auto_fill 字段详情 ===');
  console.log(JSON.stringify(autoFillField.rows, null, 2));

  await client.end();
}

main().catch(console.error);
