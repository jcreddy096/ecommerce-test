

'use client';

import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import AuthGuard from '@/guards/AuthGuard';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import { ICartProduct, IProduct } from '@/types/product';
import { IUserCartMap } from '@/types/cart';
import { getStorageProducts } from '@/utils/cart';

const OrdersPage = () => {
  const { user: loggedInUser, cartMap } = useGlobalContext();
  const [syncedCart, setSyncedCart] = useState<ICartProduct[]>([]);

  useEffect(() => {
    if (!loggedInUser) return;

    const userCart: IUserCartMap = cartMap[loggedInUser] || {};
    const products: IProduct[] = getStorageProducts();

    const updatedCart: IUserCartMap = { ...userCart };
    let priceChanged = false;

    products.forEach((product) => {
      const cartItem = userCart[product.id];
      if (cartItem && cartItem.price !== product.price) {
        updatedCart[product.id] = {
          ...cartItem,
          price: product.price,
        };
        priceChanged = true;
      }
    });

    if (priceChanged) {
      const updatedCartMap = { ...cartMap, [loggedInUser]: updatedCart };
      localStorage.setItem('cartMap', JSON.stringify(updatedCartMap));
    }

    setSyncedCart(Object.values(updatedCart));
  }, [loggedInUser, cartMap]);

  return (
    <AuthGuard>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>

        {syncedCart.length === 0 ? (
          <Typography>No items in cart.</Typography>
        ) : (
          <Box
            sx={{
              mb: 4,
              p: 3,
              border: '1px solid #ddd',
              borderRadius: 3,
              backgroundColor: '#fafafa',
            }}
          >
            <Typography variant="h6" mb={1}>
              Current Cart
            </Typography>
            <Typography>Total Items: {syncedCart.length}</Typography>
            <Typography mb={2}>
              Total: $
              {syncedCart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'center',
              }}
            >
              {syncedCart.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: '48%',
                      md: '31%',
                      lg: '23%',
                    },
                    flexGrow: 1,
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.image}
                      alt={item.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        Unit Price: ${item.price}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </AuthGuard>
  );
};

export default OrdersPage;
