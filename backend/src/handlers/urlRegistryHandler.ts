import { Request, Response, NextFunction } from 'express';
import { registerUrl, getAllUrls } from '../services/urlRegistry';
import { ErrorHandler } from '../helpers/error';
import logger from '../utils/logger';

/**
 * Handler for POST /url requests to register a new URL.
 */
export const addUrlHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    logger.info(`URL: ${req.body.url}`);
    const { url } = req.body;
    logger.info(`URL: ${url}`);

    if (!url) {
      return next(new ErrorHandler(400, 'URL is required in the request body.'));
    }

    // Register the URL using the service
    const registeredUrl = registerUrl(url);

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
export const getAllUrlsHandler = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const allUrls = getAllUrls();
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
