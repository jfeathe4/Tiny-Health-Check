import { startHealthCheckJob } from '../../src/jobs/healthCheckJob';
import cron from 'node-cron';
import { getAllUrls, updateUrlByLink } from '../../src/services/urlRegistry';
import logger from '../../src/utils/logger';
import { UrlStatus } from '../../src/models';

// Mock dependencies
jest.mock('node-cron');
jest.mock('../../src/services/urlRegistry');
jest.mock('../../src/utils/logger');

describe('Health Check Job', () => {
  let scheduledTask: () => Promise<void>;

  beforeAll(() => {
    // Mock global fetch
    global.fetch = jest.fn();

    // Polyfill AbortSignal.timeout if missing in the test environment
    // (Jest's node environment might not fully support this static method depending on version)
    if (!AbortSignal.timeout) {
      (AbortSignal as unknown as { timeout: (ms: number) => AbortSignal }).timeout = (ms: number) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), ms);
        return controller.signal;
      };
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Capture the task passed to cron.schedule so we can invoke it manually
    (cron.schedule as jest.Mock).mockImplementation((_expression, task) => {
      scheduledTask = task;
      return { stop: jest.fn() };
    });
  });

  it('schedules the cron job correctly', () => {
    startHealthCheckJob();
    expect(cron.schedule).toHaveBeenCalledWith('* * * * *', expect.any(Function));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('scheduled'));
  });

  it('skips check if no URLs are registered', async () => {
    (getAllUrls as jest.Mock).mockResolvedValue([]);

    startHealthCheckJob();
    await scheduledTask();

    expect(getAllUrls).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('No URLs to check.');
  });

  it('updates status to ONLINE when fetch succeeds', async () => {
    const mockUrl = { link: 'https://google.com', id: '1', status: UrlStatus.PENDING };
    (getAllUrls as jest.Mock).mockResolvedValue([mockUrl]);
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    startHealthCheckJob();
    await scheduledTask();

    expect(global.fetch).toHaveBeenCalledWith('https://google.com', expect.anything());
    expect(updateUrlByLink).toHaveBeenCalledWith(
      'https://google.com',
      expect.objectContaining({
        status: UrlStatus.ONLINE,
        link: 'https://google.com',
      }),
    );
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('online'));
  });

  it('updates status to OFFLINE when fetch returns non-ok status', async () => {
    const mockUrl = { link: 'https://bing.com', id: '2', status: UrlStatus.PENDING };
    (getAllUrls as jest.Mock).mockResolvedValue([mockUrl]);
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    startHealthCheckJob();
    await scheduledTask();

    expect(updateUrlByLink).toHaveBeenCalledWith(
      'https://bing.com',
      expect.objectContaining({
        status: UrlStatus.OFFLINE,
      }),
    );
  });

  it('updates status to OFFLINE and logs warning on fetch error', async () => {
    const mockUrl = { link: 'https://error.com', id: '3', status: UrlStatus.PENDING };
    (getAllUrls as jest.Mock).mockResolvedValue([mockUrl]);
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Timeout'));

    startHealthCheckJob();
    await scheduledTask();

    expect(updateUrlByLink).toHaveBeenCalledWith('https://error.com', expect.objectContaining({ status: UrlStatus.OFFLINE }));
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Error: Timeout'));
  });
});
