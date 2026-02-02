import { registerUrl, getAllUrls } from '../../src/services/urlRegistry';
import { UrlStatus } from '../../src/models';

describe('URL Registry Service', () => {
  const testUrl = 'https://example.com/';

  it('should register a new URL successfully', async () => {
    const result = await registerUrl(testUrl);

    expect(result).toHaveProperty('id');
    expect(result.link).toBe(testUrl);
    expect(result.status).toBe(UrlStatus.PENDING);
  });

  it('should throw an error when registering a duplicate URL', async () => {
    await expect(registerUrl(testUrl)).rejects.toThrow('URL is already registered.');
  });

  it('should throw an error for invalid URL format', async () => {
    const invalidUrl = 'not-a-url';
    await expect(registerUrl(invalidUrl)).rejects.toThrow('Invalid URL format.');
  });

  it('should retrieve all registered URLs', async () => {
    const urls = await getAllUrls();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThanOrEqual(1);
    const found = urls.find((u) => u.link === testUrl);
    expect(found).toBeDefined();
  });
});
