// This file is a placeholder for your health check service.
import { Request, Response } from 'express';
import logger from '../utils/logger';

export const healthCheck = async (_req: Request, res: Response) => {
  logger.info('Server is starting');
  res.send('Server is working');
};
