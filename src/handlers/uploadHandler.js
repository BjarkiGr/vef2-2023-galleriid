/* eslint-disable object-curly-newline */
import multer from 'multer';
import sharp from 'sharp';
import pool from '../lib/db.js';

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
    }
  },
});

const imageUploadMiddleware = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'name', maxCount: 1 },
  { name: 'description', maxCount: 1 },
  { name: 'tags', maxCount: 1 },
  { name: 'userId', maxCount: 1 }, // added field
]);

export default async function uploadImage(req, res) {
  imageUploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const imageFile = req.files.image[0];
    if (!imageFile) {
      res.status(400).json({ message: 'No image uploaded' });
      return;
    }

    const { name, description, tags, userId } = req.body;
    if (!userId) {
      res.status(400).json({ message: 'Must be logged in to upload' });
      return;
    }

    const compressedImageBuffer = await sharp(imageFile.buffer)
      .jpeg({ quality: 50 })
      .toBuffer();

    const compressedImageSize = compressedImageBuffer.length;
    if (compressedImageSize > 1024 * 1024) {
      res.status(400).json({ message: 'File too large' });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const queryText =
        'INSERT INTO images (name, data, filesize, user_id, description, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
      const result = await client.query(queryText, [
        name || imageFile.originalname,
        compressedImageBuffer,
        compressedImageSize,
        userId,
        description || null,
        tags ? tags.split(',') : [],
      ]);

      await client.query('COMMIT');

      res.status(200).json({
        message: 'File uploaded and compressed successfully',
        imageId: result.rows[0].id,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release();
    }
  });
}
