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

  // 查询新工作流的节点
  const nodes = await client.query(`
    SELECT id, type, title, config, "upstreamId", "downstreamId"
    FROM flow_nodes
    WHERE "workflowId" = '358010098417664'
    ORDER BY id
  `);
  console.log('=== 操作后事件工作流的节点 ===');
  nodes.rows.forEach(n => {
    console.log(`\n节点: ${n.title} (${n.type})`);
    console.log(`配置: ${JSON.stringify(n.config, null, 2)}`);
  });

  // 查询操作后事件触发器的详细配置
  const triggerNode = await client.query(`
    SELECT id, type, title, config
    FROM flow_nodes
    WHERE "workflowId" = '358010098417664' AND type = 'trigger'
  `);
  console.log('\n=== 触发器节点 ===');
  console.log(JSON.stringify(triggerNode.rows, null, 2));

  await client.end();
}

main().catch(console.error);
