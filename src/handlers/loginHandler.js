import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../lib/db.js';

dotenv.config();

export default async function login(req, res) {
  try {
    const { email, password } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const user = result.rows[0];
      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, email: user.email, username: user.username },
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
