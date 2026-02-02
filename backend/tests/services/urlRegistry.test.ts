import { registerUrl, getAllUrls } from '../../src/services/urlRegistry';
import { UrlStatus } from '../../src/models';

describe('URL Registry Service', () => {
  const testUrl = 'https://example.com/';

  it('should register a new URL successfully', () => {
    const result = registerUrl(testUrl);

    expect(result).toHaveProperty('id');
    expect(result.link).toBe(testUrl);
    expect(result.status).toBe(UrlStatus.PENDING);
  });

  it('should throw an error when registering a duplicate URL', () => {
    expect(() => {
      registerUrl(testUrl);
    }).toThrow('URL is already registered.');
  });

  it('should throw an error for invalid URL format', () => {
    const invalidUrl = 'not-a-url';
    expect(() => {
      registerUrl(invalidUrl);
    }).toThrow('Invalid URL format.');
  });

  it('should retrieve all registered URLs', () => {
    const urls = getAllUrls();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThanOrEqual(1);
    const found = urls.find((u) => u.link === testUrl);
    expect(found).toBeDefined();
  });
});
