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
  
  // 查询 AI 员工
  const aiEmployees = await client.query('SELECT * FROM "aiEmployees"');
  console.log('=== AI Employees ===');
  console.log(JSON.stringify(aiEmployees.rows, null, 2));
  
  // 查询 usersAiEmployees 关联
  const userAiEmployee = await client.query('SELECT * FROM "usersAiEmployees" LIMIT 5');
  console.log('\n=== Users AiEmployees ===');
  console.log(JSON.stringify(userAiEmployee.rows, null, 2));
  
  await client.end();
}

main().catch(console.error);
