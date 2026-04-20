const { Client } = require('pg');

async function getTableData(dbName, tableName) {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: dbName,
  });

  try {
    await client.connect();
    const result = await client.query(`SELECT * FROM "${tableName}" ORDER BY id LIMIT 5`);
    return result.rows;
  } catch (e) {
    return [];
  } finally {
    await client.end();
  }
}

async function main() {
  const tables = ['applicationPlugins', 'collections', 'fields'];

  for (const table of tables) {
    console.log(`\n=== ${table} 表对比 ===\n`);

    const bmData = await getTableData('big-model', table);
    const ncData = await getTableData('nocobase', table);

    console.log(`big-model (${bmData.length} 行):`);
    console.log(JSON.stringify(bmData, null, 2).substring(0, 500));

    console.log(`\nnocobase (${ncData.length} 行):`);
    console.log(JSON.stringify(ncData, null, 2).substring(0, 500));
  }
}

main();
