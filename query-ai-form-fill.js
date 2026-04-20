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
  
  // 查询所有工作流及其触发器
  const workflowsWithTrigger = await client.query(`
    SELECT w.id, w.title, w.enabled, w.type, w.config,
           fn.id as trigger_node_id, fn.type as trigger_type, fn.config as trigger_config
    FROM workflows w
    LEFT JOIN flow_nodes fn ON fn."workflowId" = w.id AND fn.type = 'trigger'
  `);
  console.log('=== Workflows with Triggers ===');
  console.log(JSON.stringify(workflowsWithTrigger.rows, null, 2));
  
  // 查询 aiEmployees 中的 workagent 相关配置
  const aiEmpWorkagent = await client.query(`
    SELECT username, nickname, config, "modelSettings"
    FROM "aiEmployees"
    WHERE config::text LIKE '%workagent%' OR config::text LIKE '%formFill%'
  `);
  console.log('\n=== AI Employees with workagent ===');
  console.log(JSON.stringify(aiEmpWorkagent.rows, null, 2));
  
  await client.end();
}

main().catch(console.error);
