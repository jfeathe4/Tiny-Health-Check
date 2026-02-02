// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddUrlForm } from '../../src/components/AddUrl';
import { createRegisteredUrl } from '../../src/api/registeredUrls';
import { AxiosError, type AxiosResponse } from 'axios';

// Mock the API dependencies
vi.mock('../../src/api/registeredUrls', () => ({
  createRegisteredUrl: vi.fn(),
}));

describe('AddUrlForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<AddUrlForm />);
    expect(screen.getByLabelText(/Add New URL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<AddUrlForm />);
    const input = screen.getByLabelText(/Add New URL/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    expect(input.value).toBe('https://test.com');
  });

  it('submits the form successfully', async () => {
    (createRegisteredUrl as Mock).mockResolvedValue({});
    const onSuccessMock = vi.fn();

    render(<AddUrlForm onSuccess={onSuccessMock} />);
    
    const input = screen.getByLabelText(/Add New URL/i);
    fireEvent.change(input, { target: { value: 'https://success.com' } });
    
    const button = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(createRegisteredUrl).toHaveBeenCalledWith('https://success.com');
    });

    expect(screen.getByText(/URL added successfully!/i)).toBeInTheDocument();
    expect(onSuccessMock).toHaveBeenCalled();
    
    // Check if input is cleared
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('handles 409 conflict error', async () => {
    const error = new AxiosError('Conflict');
    error.response = { status: 409 } as unknown as AxiosResponse;
    (createRegisteredUrl as Mock).mockRejectedValue(error);

    render(<AddUrlForm />);
    
    const input = screen.getByLabelText(/Add New URL/i);
    fireEvent.change(input, { target: { value: 'https://duplicate.com' } });
    
    const button = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/This URL has already been added/i)).toBeInTheDocument();
    });
  });

  it('handles generic errors', async () => {
    (createRegisteredUrl as Mock).mockRejectedValue(new Error('Network Error'));

    render(<AddUrlForm />);
    
    const input = screen.getByLabelText(/Add New URL/i);
    fireEvent.change(input, { target: { value: 'https://fail.com' } });
    
    const button = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to add URL/i)).toBeInTheDocument();
    });
  });
});