import { Router } from 'express';
import uploadImage from '../handlers/uploadHandler.js';
import getImages from '../handlers/imagesHandler.js';
import deleteImage from '../handlers/deleteImageHandler.js';
import getImageById from '../handlers/imageHandler.js';
import getUserById from '../handlers/userHandler.js';

const router = Router();

router.post('/upload', uploadImage);
router.get('/images', getImages);
router.get('/images/:id', getImageById);
router.delete('/delete/:id', deleteImage);
router.get('/user/:username', getUserById);

export default router;
