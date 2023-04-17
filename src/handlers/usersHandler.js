import dotenv from 'dotenv';
import pool from '../lib/db.js';

dotenv.config();

export default async function getUsers(req, res) {
  try {
    const client = await pool.connect();

    try {
      const result = await client.query(
        'SELECT id, email, username, created_at, admin FROM users'
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
