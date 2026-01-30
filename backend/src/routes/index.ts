import express from 'express';
// import { healthCheck } from '../handlers/healthCheck';
import { addUrlHandler, getAllUrlsHandler } from '../handlers/urlRegistryHandler';

const router = express.Router();

/* GET home page. */
// router.get('/', healthCheck);

/* POST a new URL to be monitored. */
router.post('/api/v1/url', addUrlHandler);

router.get('/api/v1/url', getAllUrlsHandler);

export default router;
