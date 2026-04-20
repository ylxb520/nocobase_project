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

  // 先查看 collections 表结构
  const cols = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'collections'
  `);
  console.log('=== collections 表结构 ===');
  console.log(JSON.stringify(cols.rows, null, 2));

  // 查询 collections 表数据
  const collData = await client.query(`
    SELECT *
    FROM collections
    WHERE name = 'material_submissions'
  `);
  console.log('\n=== material_submissions collection 数据 ===');
  console.log(JSON.stringify(collData.rows, null, 2));

  await client.end();
}

main().catch(console.error);
