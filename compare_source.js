const { Client } = require('pg');

async function compareTableCounts() {
  const tables = [
    'applicationPlugins',
    'attachments',
    'collections',
    'fields',
    'main_desktopRoutes_path',
    'uiSchemas',
    'uiSchemaTreePath',
  ];

  const bmClient = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'big-model',
  });

  const ncClient = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'nocobase',
  });

  try {
    await bmClient.connect();
    await ncClient.connect();

    console.log('=== 对比源数据库和目标数据库 ===\n');
    console.log('表名'.padEnd(35) + 'big-model'.padStart(12) + 'nocobase'.padStart(12));
    console.log('-'.repeat(59));

    for (const table of tables) {
      try {
        const bmResult = await bmClient.query(`SELECT COUNT(*) FROM "${table}"`);
        const ncResult = await ncClient.query(`SELECT COUNT(*) FROM "${table}"`);
        const bmCount = parseInt(bmResult.rows[0].count);
        const ncCount = parseInt(ncResult.rows[0].count);
        const match = bmCount === ncCount ? '✅' : '❌';
        console.log(table.padEnd(35) + String(bmCount).padStart(12) + String(ncCount).padStart(12) + '  ' + match);
      } catch (e) {
        console.log(table.padEnd(35) + 'ERROR'.padStart(12) + 'ERROR'.padStart(12));
      }
    }

    // 检查 nocobase 是否有触发器
    const triggerResult = await ncClient.query(`
      SELECT trigger_name, event_manipulation, event_object_table 
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public'
      LIMIT 20
    `);

    console.log('\n=== nocobase 数据库中的触发器 ===');
    if (triggerResult.rows.length === 0) {
      console.log('无触发器');
    } else {
      triggerResult.rows.forEach((row) => {
        console.log(`${row.trigger_name} ON ${row.event_object_table} (${row.event_manipulation})`);
      });
    }
  } finally {
    await bmClient.end();
    await ncClient.end();
  }
}

compareTableCounts();
