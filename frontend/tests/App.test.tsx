import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the main title', () => {
    render(<App />);
    
    // Check if the main heading exists
    expect(screen.getByText('Tiny Health Check')).toBeInTheDocument();
  });
});
