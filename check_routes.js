const { Client } = require('pg');

async function checkTableContent() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'nocobase',
  });

  try {
    await client.connect();

    // 查看 main_desktopRoutes_path 表结构和数据
    const result = await client.query(`
      SELECT * FROM "main_desktopRoutes_path" ORDER BY id DESC LIMIT 10
    `);

    console.log('=== main_desktopRoutes_path 表数据 ===\n');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (e) {
    console.error('错误:', e.message);
  } finally {
    await client.end();
  }
}

checkTableContent();
