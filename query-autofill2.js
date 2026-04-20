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
  
  // 查询 material_submissions 表的所有字段
  const columns = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'material_submissions'
    ORDER BY ordinal_position
  `);
  console.log('=== material_submissions 所有字段 ===');
  columns.rows.forEach(c => console.log(`${c.column_name} (${c.data_type})`));
  
  // 查询最近一条记录的 Auto_fill 字段
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
