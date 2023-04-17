import pool from '../lib/db.js';

export default async function getImageById(req, res) {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    try {
      const result = await client.query(
        'SELECT id, name, filesize, data, user_id, created_at, tags, description FROM images WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
        res.status(404).json({ message: 'Image not found' });
        return;
      }

      const row = result.rows[0];
      const imageData = Buffer.from(row.data).toString('base64');

      const image = {
        id: row.id,
        name: row.name,
        filesize: row.filesize,
        imageData,
        user_id: row.user_id,
        created_at: row.created_at,
        tags: row.tags,
        description: row.description,
      };

      res.status(200).json(image);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
