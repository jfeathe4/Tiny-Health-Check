import { Request, Response, NextFunction } from 'express';
import { registerUrl, getAllUrls } from '../services/urlRegistry';
import { ErrorHandler } from '../utils/error';
import logger from '../utils/logger';

/**
 * Handler for POST /url requests to register a new URL.
 */
export const addUrlHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { url } = req.body;
    logger.info(`URL: ${url}`);

    if (!url) {
      return next(new ErrorHandler(400, 'URL is required in the request body.'));
    }

    // Register the URL using the service
    const registeredUrl = await registerUrl(url);

    logger.info(`Successfully registered new URL: ${registeredUrl.link}`);

    // Send a success response
    res.status(201).json({
      status: 'success',
      message: 'URL registered successfully.',
      data: registeredUrl,
    });
  } catch (error) {
    // Pass any errors to the global error handler
    if (error instanceof Error) {
      logger.error(`Failed to register URL: ${error.message}`);
    }
    next(error);
  }
};

/**
 * Handler for GET /urls requests to retrieve all registered URLs.
 */
export const getAllUrlsHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allUrls = await getAllUrls();
    res.status(200).json({
      status: 'success',
      results: allUrls.length,
      data: allUrls,
    });
  } catch (error) {
    logger.error('Failed to retrieve URLs:', error);
    next(new ErrorHandler(500, 'An unexpected error occurred while retrieving URLs.'));
  }
};
