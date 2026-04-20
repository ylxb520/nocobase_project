const { Client } = require('pg');

async function checkCollections() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'nocobase',
  });

  try {
    await client.connect();

    // 查询 collections 表
    const result = await client.query(`
      SELECT name, title, "sortBy", template, hidden
      FROM collections
      WHERE name LIKE '%material%'
      ORDER BY name
    `);

    console.log('collections 表中的 material 相关记录:');
    console.log(JSON.stringify(result.rows, null, 2));

    // 查询所有 collection 名称
    const allResult = await client.query(`
      SELECT name, title
      FROM collections
      ORDER BY name
      LIMIT 50
    `);

    console.log('\n所有 collection 名称 (前50个):');
    allResult.rows.forEach((row) => {
      console.log(`  - ${row.name} (${row.title || '无标题'})`);
    });

    await client.end();
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

checkCollections();
