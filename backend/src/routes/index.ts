import express from 'express';
import { addUrlHandler, getAllUrlsHandler } from '../handlers/urlRegistryHandler';

const router = express.Router();

router.post('/api/v1/url', addUrlHandler);

router.get('/api/v1/url', getAllUrlsHandler);

export default router;
