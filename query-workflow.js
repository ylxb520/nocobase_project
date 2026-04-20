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
  
  // 查询所有工作流
  const workflows = await client.query('SELECT id, title, enabled, type, config FROM workflows');
  console.log('=== Workflows ===');
  console.log(JSON.stringify(workflows.rows, null, 2));
  
  // 查询工作流节点
  const nodes = await client.query('SELECT id, "workflowId", type, title, config FROM flow_nodes');
  console.log('\n=== Flow Nodes ===');
  console.log(JSON.stringify(nodes.rows, null, 2));
  
  // 查询执行记录
  const executions = await client.query('SELECT id, "workflowId", status, "createdAt" FROM executions ORDER BY "createdAt" DESC LIMIT 10');
  console.log('\n=== Recent Executions ===');
  console.log(JSON.stringify(executions.rows, null, 2));
  
  await client.end();
}

main().catch(console.error);
