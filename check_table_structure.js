const { Client } = require('pg');

async function checkTableStructure() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'nocobase',
  });

  try {
    await client.connect();

    // 查看表结构
    const structureResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'main_desktopRoutes_path'
    `);

    console.log('=== main_desktopRoutes_path 表结构 ===\n');
    console.log(JSON.stringify(structureResult.rows, null, 2));

    // 查看表数据
    const dataResult = await client.query(`SELECT * FROM "main_desktopRoutes_path" LIMIT 10`);
    console.log('\n=== 数据 ===\n');
    console.log(JSON.stringify(dataResult.rows, null, 2));
  } catch (e) {
    console.error('错误:', e.message);
  } finally {
    await client.end();
  }
}

checkTableStructure();
