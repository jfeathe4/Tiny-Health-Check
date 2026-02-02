// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UrlList } from '../../src/components/UrlList';
import { getRegisteredUrls } from '../../src/api/registeredUrls';
import { RegisteredUrl, UrlStatus } from '../../src/models/index';

// Mock the API dependencies
vi.mock('../../src/api/registeredUrls', () => ({
  getRegisteredUrls: vi.fn(),
  deleteRegisteredUrl: vi.fn(),
}));

describe('UrlList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Return a pending promise to simulate loading
    (getRegisteredUrls as Mock).mockReturnValue(new Promise(() => {}));

    render(<UrlList />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders a list of URLs when data is fetched successfully', async () => {
    const mockData: RegisteredUrl[] = [
      { id: '1', link: 'https://google.com', status: UrlStatus.ONLINE, responseTime: 100 },
      { id: '2', link: 'https://example.com', status: UrlStatus.OFFLINE },
    ];
    (getRegisteredUrls as Mock).mockResolvedValue(mockData);

    render(<UrlList />);

    await waitFor(() => {
      expect(screen.getByText('https://google.com')).toBeInTheDocument();
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });
  });

  it('renders an error message if the fetch fails', async () => {
    (getRegisteredUrls as Mock).mockRejectedValue(new Error('Failed to fetch URLs'));

    render(<UrlList />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch URLs/i)).toBeInTheDocument();
    });
  });
});
