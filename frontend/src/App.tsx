import { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { AddUrlForm } from './components/AddUrl';
import { UrlList } from './components/UrlList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setRefreshKey((prev) => prev + 1);
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, minHeight: '90vh' }}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Tiny Health Check
          </Typography>
        </Box>
        <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto' }}>
          <AddUrlForm onSuccess={() => setRefreshKey((prev) => prev + 1)} />
        </Box>
        <UrlList key={refreshKey} />
      </Box>
    </Container>
  );
}

export default App;
