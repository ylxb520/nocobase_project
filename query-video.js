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
  const result = await client.query("SELECT * FROM uiSchemas WHERE schema::text LIKE '%videoUrl%' LIMIT 5");
  console.log(JSON.stringify(result.rows, null, 2));
  await client.end();
}

main().catch(console.error);
