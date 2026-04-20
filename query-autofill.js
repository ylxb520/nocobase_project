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
  
  // 查询是否有 Auto_fill 相关的字段
  const columns = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'material_submissions'
    AND column_name ILIKE '%auto%'
  `);
  console.log('=== Auto 相关字段 ===');
  console.log(JSON.stringify(columns.rows, null, 2));
  
  // 查询是否有 Auto_fill 关联表
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name ILIKE '%auto%'
  `);
  console.log('\n=== Auto 相关表 ===');
  console.log(JSON.stringify(tables.rows, null, 2));
  
  // 查询最近的完整数据
  const data = await client.query(`
    SELECT id, "Auto_fill"
    FROM material_submissions 
    ORDER BY "updatedAt" DESC 
    LIMIT 1
  `);
  console.log('\n=== Auto_fill 字段数据 ===');
  console.log(JSON.stringify(data.rows, null, 2));
  
  await client.end();
}

main().catch(console.error);
