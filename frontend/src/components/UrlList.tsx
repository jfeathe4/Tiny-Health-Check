import { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { RegisteredUrl, UrlStatus } from '../models';
import { getRegisteredUrls } from '../api/registeredUrls';

export const UrlList = () => {
  const [urls, setUrls] = useState<RegisteredUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = async () => {
    try {
      const data = await getRegisteredUrls();
      console.log('UrlList fetched data:', data);
      setUrls(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {urls.map((row) => (
          <Grid item xs={12} sm={6} md={4} key={row.id}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Tooltip title={row.status}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: row.status === UrlStatus.ONLINE ? 'success.main' : row.status === UrlStatus.OFFLINE ? 'error.main' : 'grey.500',
                        mr: 2,
                      }}
                    />
                  </Tooltip>
                  <Typography variant="h6" noWrap title={row.link}>
                    {row.link}
                  </Typography>
                </Box>
                <Typography color="text.secondary" variant="body2">
                  Response Time: {row.responseTime ? `${row.responseTime}ms` : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {urls.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">No URLs found.</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
