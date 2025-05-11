import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#eef2f7',
        p: { xs: 2, sm: 4, md: 6 }
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6">Your cart is empty</Typography>
      ) : (
        <Grid container spacing={4}>
          {cartItems.map((item) => (
            <Grid item key={item._id} xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Typography>Price: ${item.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="secondary">
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Cart;