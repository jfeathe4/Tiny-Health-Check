import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Box, Paper, Button, TextField, Alert, CircularProgress } from '@mui/material';
import { createRegisteredUrl } from '../api/registeredUrls';

interface AddUrlFormProps {
  onSuccess?: () => void;
}

export const AddUrlForm = ({ onSuccess }: AddUrlFormProps) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await createRegisteredUrl(url);
      setSuccessMessage('URL added successfully!');
      setUrl('');
      if (onSuccess) onSuccess();

      // Clear success message after a brief delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      if (isAxiosError(err) && err.response?.status === 409) {
        setError('This URL has already been added.');
      } else {
        setError('Failed to add URL. Please check the input and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextField
            id="url"
            label="Add New URL"
            type="url"
            fullWidth
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            placeholder="https://example.com"
            size="small"
          />
          <Button type="submit" variant="contained" disabled={loading || !url} sx={{ minWidth: '100px' }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </Box>
    </Paper>
  );
};
