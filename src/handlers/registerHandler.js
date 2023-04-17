import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../lib/db.js';

dotenv.config();

export default async function register(req, res) {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await hash(password, 10);

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const emailResult = await client.query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
        [email]
      );

      if (emailResult.rows.length > 0) {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }

      const usernameResult = await client.query(
        'SELECT * FROM users WHERE LOWER(username) = LOWER($1)',
        [username]
      );

      if (usernameResult.rows.length > 0) {
        res.status(409).json({ message: 'Username already exists' });
        return;
      }

      const result = await client.query(
        'INSERT INTO users(email, username, password) VALUES ($1, $2, $3) RETURNING id',
        [email, username, hashedPassword]
      );

      const user = { id: result.rows[0].id, email, username };
      await client.query('COMMIT');

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).json({
        message: 'User created',
        user,
        token,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
