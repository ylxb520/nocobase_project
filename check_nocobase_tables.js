const { Client } = require('pg');

async function checkDatabase(dbName) {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: dbName,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
    );

    console.log(`\n=== ${dbName} 数据库: ${result.rows.length} 个表 ===`);
    return result.rows.length;
  } catch (error) {
    console.error(`${dbName} 错误:`, error.message);
    return 0;
  } finally {
    await client.end();
  }
}

async function main() {
  const bigModelCount = await checkDatabase('big-model');
  const nocobaseCount = await checkDatabase('nocobase');

  console.log('\n=== 对比结果 ===');
  console.log(`big-model: ${bigModelCount} 个表`);
  console.log(`nocobase:  ${nocobaseCount} 个表`);

  if (bigModelCount === nocobaseCount) {
    console.log('✅ 表数量一致，迁移成功！');
  } else {
    console.log('❌ 表数量不一致，迁移可能有问题！');
  }
}

main();
