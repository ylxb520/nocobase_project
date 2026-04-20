const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'nocobase',
  user: 'postgres',
  password: '123456',
});

async function main() {
  await client.connect();

  // 查看中间表数据
  const throughTable = await client.query(`
    SELECT *
    FROM t_xdz9l7phr8b
    LIMIT 10
  `);
  console.log('=== 中间表 t_xdz9l7phr8b 数据 ===');
  console.log(JSON.stringify(throughTable.rows, null, 2));

  // 查询 material_submissions 的 Auto_fill 关联数据
  const autoFillData = await client.query(`
    SELECT ms.id, a.filename, a.url
    FROM material_submissions ms
    LEFT JOIN t_xdz9l7phr8b rel ON ms.id = rel.f_n3prmobf9nv
    LEFT JOIN attachments a ON rel.f_kyvsqeiz2ij = a.id
    LIMIT 10
  `);
  console.log('\n=== Auto_fill 关联数据 ===');
  console.log(JSON.stringify(autoFillData.rows, null, 2));

  await client.end();
}

main().catch(console.error);
