import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome to Book Store
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Discover your next favorite book from our carefully curated collection.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" component={Link} to="/books">
            Browse Books
          </Button>
          <Button variant="outlined" component={Link} to="/register">
            Join Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;