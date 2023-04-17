import dotenv from 'dotenv';
import pool from '../lib/db.js';

dotenv.config();

export default async function getUserbyUsername(req, res) {
  try {
    const { username } = req.params;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const userResult = await client.query(
        'SELECT id, email, username, created_at, admin FROM users WHERE LOWER(username) = LOWER($1)',
        [username]
      );

      if (userResult.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userId = userResult.rows[0].id;
      const imagesResult = await client.query(
        'SELECT id, name, filesize, data, user_id, created_at FROM images WHERE user_id = $1',
        [userId]
      );

      const user = userResult.rows[0];
      const images = imagesResult.rows.map((row) => {
        const imageData = Buffer.from(row.data).toString('base64');
        return {
          id: row.id,
          name: row.name,
          filesize: row.filesize,
          imageData,
          user_id: row.user_id,
          created_at: row.created_at,
        };
      });

      await client.query('COMMIT');

      res.status(200).json({ user, images });
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
