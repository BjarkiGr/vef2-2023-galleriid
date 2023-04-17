import pool from '../lib/db.js';

export default async function getImages(req, res) {
  try {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT 
          images.id, 
          images.name, 
          images.filesize, 
          images.data, 
          users.username, 
          images.description, 
          images.tags, 
          images.created_at 
        FROM 
          images 
          JOIN users ON images.user_id = users.id
      `);

      const images = result.rows.map((row) => {
        const imageData = Buffer.from(row.data).toString('base64');
        return {
          id: row.id,
          name: row.name,
          filesize: row.filesize,
          imageData,
          username: row.username,
          description: row.description,
          tags: row.tags,
          created_at: row.created_at,
        };
      });

      res.status(200).json(images);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
