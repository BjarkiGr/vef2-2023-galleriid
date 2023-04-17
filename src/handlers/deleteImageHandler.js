import pool from '../lib/db.js';

export default async function deleteImage(req, res) {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM images WHERE id = $1', [
        id,
      ]);

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Image not found' });
      }

      await client.query('DELETE FROM images WHERE id = $1', [id]);
      res.status(204).send();
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
