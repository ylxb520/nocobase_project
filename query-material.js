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
  
  // 查询 material_submissions 表结构
  const columns = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'material_submissions'
  `);
  console.log('=== material_submissions 表结构 ===');
  console.log(JSON.stringify(columns.rows, null, 2));
  
  // 查询最近的数据记录
  const data = await client.query(`
    SELECT id, "createdAt", "updatedAt" 
    FROM material_submissions 
    ORDER BY "updatedAt" DESC 
    LIMIT 5
  `);
  console.log('\n=== 最近的数据记录 ===');
  console.log(JSON.stringify(data.rows, null, 2));
  
  await client.end();
}

main().catch(console.error);
