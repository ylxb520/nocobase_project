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
  
  // 查询工作流的触发器节点
  const triggerNode = await client.query(`
    SELECT id, type, title, config 
    FROM flow_nodes 
    WHERE "workflowId" = '357985828667392' AND type = 'trigger'
  `);
  console.log('=== Trigger Node ===');
  console.log(JSON.stringify(triggerNode.rows, null, 2));
  
  // 查询该工作流的所有节点
  const allNodes = await client.query(`
    SELECT id, type, title, "downstreamId", "upstreamId" 
    FROM flow_nodes 
    WHERE "workflowId" = '357985828667392' 
    ORDER BY id
  `);
  console.log('\n=== All Nodes ===');
  console.log(JSON.stringify(allNodes.rows, null, 2));
  
  await client.end();
}

main().catch(console.error);
