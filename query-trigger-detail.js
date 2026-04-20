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
  
  // 查询工作流的完整配置
  const workflow = await client.query(`
    SELECT id, title, enabled, type, config
    FROM workflows 
    WHERE id = '357985828667392'
  `);
  
  if (workflow.rows.length > 0) {
    const wf = workflow.rows[0];
    console.log('=== Workflow Info ===');
    console.log('ID:', wf.id);
    console.log('Title:', wf.title);
    console.log('Enabled:', wf.enabled);
    console.log('Type:', wf.type);
    console.log('\n=== Trigger Config (from workflow.config) ===');
    console.log(JSON.stringify(wf.config, null, 2));
  }
  
  await client.end();
}

main().catch(console.error);
