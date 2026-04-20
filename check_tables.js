const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'big-model',
  });

  try {
    await client.connect();
    console.log('=== big-model 数据库中的表 ===\n');

    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
    );

    result.rows.forEach((row, i) => {
      console.log(`${(i + 1).toString().padStart(3)}. ${row.table_name}`);
    });

    console.log(`\n总计: ${result.rows.length} 个表`);
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await client.end();
  }
}

main();
