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
  
  // 查询完整的工作流配置
  const workflow = await client.query(`
    SELECT id, title, enabled, type, config, "createdAt", "updatedAt"
    FROM workflows 
    WHERE id = '357985828667392'
  `);
  console.log('=== Workflow Full ===');
  console.log(JSON.stringify(workflow.rows, null, 2));
  
  // 查询所有 flow_nodes 的详细配置
  const nodes = await client.query(`
    SELECT id, type, title, config, "downstreamId", "upstreamId", "branchIndex"
    FROM flow_nodes 
    WHERE "workflowId" = '357985828667392'
  `);
  console.log('\n=== Nodes Detail ===');
  for (const node of nodes.rows) {
    console.log(`\n--- Node: ${node.title} (${node.type}) ---`);
    console.log('Config:', JSON.stringify(node.config, null, 2));
  }
  
  await client.end();
}

main().catch(console.error);
