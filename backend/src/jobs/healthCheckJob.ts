import cron from 'node-cron';
import { getAllUrls, updateUrlByLink } from '../services/urlRegistry';
import { RegisteredUrl, UrlStatus } from '../models';
import logger from '../utils/logger';

/**
 * Performs a health check on a single URL.
 * @param urlEntry The RegisteredUrl object to check.
 */
const checkUrl = async (urlEntry: RegisteredUrl): Promise<void> => {
  const startTime = Date.now();
  let status: UrlStatus;
  let responseTime;

  try {
    const response = await fetch(urlEntry.link, { signal: AbortSignal.timeout(5000) }); // 5-second timeout
    responseTime = Date.now() - startTime;
    status = response.ok ? UrlStatus.ONLINE : UrlStatus.OFFLINE;
    logger.info(`Checked ${urlEntry.link}: ${status} (${responseTime}ms)`);
  } catch (error) {
    responseTime = Date.now() - startTime;
    status = UrlStatus.OFFLINE;
    logger.warn(`Checked ${urlEntry.link}: ${status} (${responseTime}ms) - Error: ${(error as Error).message}`);
  }

  // Create the updated entry
  const updatedEntry: RegisteredUrl = {
    ...urlEntry,
    status,
    responseTime,
    lastChecked: new Date(),
  };

  // Update the URL in our registry
  updateUrlByLink(updatedEntry.link, updatedEntry);
};

/**
 * The main task runner that gets all URLs and checks them.
 */
const task = async () => {
  logger.info('Running scheduled health check job...');
  const allUrls = getAllUrls();

  if (allUrls.length === 0) {
    logger.info('No URLs to check.');
    return;
  }

  // Create an array of promises for all the checks
  const checkPromises = allUrls.map(checkUrl);

  // Wait for all checks to complete
  await Promise.all(checkPromises);
  logger.info('Health check job finished.');
};

/**
 * Initializes and starts the cron job.
 * The job is scheduled to run every minute.
 */
export const startHealthCheckJob = () => {
  // Schedule the task to run every minute.
  // For more info on cron patterns: https://crontab.guru/
  const job = cron.schedule('* * * * *', task);

  logger.info('Health check job scheduled to run every minute.');

  // You can stop the job gracefully on application shutdown
  process.on('SIGINT', () => {
    logger.info('Stopping health check job...');
    job.stop();
  });
};
