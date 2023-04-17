import { readFileSync } from 'fs';
import pool from './lib/db.js';

async function setup() {
  const client = await pool.connect();
  try {
    console.log('Connected to database.');

    const dropSql = readFileSync('./sql/drop.sql').toString();
    await client.query(dropSql);
    console.log('Tables dropped successfully!');

    const sql = readFileSync('./sql/schema.sql').toString();
    await client.query(sql);

    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
}

setup()
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    process.exit(1);
  });
