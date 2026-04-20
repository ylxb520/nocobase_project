const { Client } = require('pg');

async function getTableRowCounts(dbName) {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: dbName,
  });

  try {
    await client.connect();

    // 获取所有表名
    const tablesResult = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
    );

    const counts = {};

    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
        counts[tableName] = parseInt(countResult.rows[0].count);
      } catch (e) {
        counts[tableName] = 'error';
      }
    }

    return counts;
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('正在统计 big-model 数据库...');
  const bigModelCounts = await getTableRowCounts('big-model');

  console.log('正在统计 nocobase 数据库...');
  const nocobaseCounts = await getTableRowCounts('nocobase');

  console.log('\n=== 数据对比 (显示有差异的表) ===\n');
  console.log('表名'.padEnd(40) + 'big-model'.padStart(12) + 'nocobase'.padStart(12) + '状态'.padStart(8));
  console.log('-'.repeat(72));

  let matchCount = 0;
  let mismatchCount = 0;

  for (const table of Object.keys(bigModelCounts).sort()) {
    const bmCount = bigModelCounts[table];
    const ncCount = nocobaseCounts[table];

    if (bmCount === ncCount) {
      matchCount++;
    } else {
      mismatchCount++;
      console.log(table.padEnd(40) + String(bmCount).padStart(12) + String(ncCount).padStart(12) + '❌'.padStart(8));
    }
  }

  console.log('-'.repeat(72));
  console.log(`\n匹配: ${matchCount} 个表`);
  console.log(`不匹配: ${mismatchCount} 个表`);

  if (mismatchCount === 0) {
    console.log('\n✅ 所有表数据完全一致！');
  }
}

main();
