const { Client } = require('pg');

async function reset() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'postgres', // Connect to default database
    user: 'postgres',
    password: '123456'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL...');

    // Drop database if exists
    await client.query('DROP DATABASE IF EXISTS nocobase;');
    console.log('Dropped database nocobase');

    // Create new database
    await client.query('CREATE DATABASE nocobase;');
    console.log('Created database nocobase');

    console.log('Database reset successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

reset();
