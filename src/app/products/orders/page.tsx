

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
} from '@mui/material';
import { ICartProduct, IProduct } from '@/types/product';
import { getStorageProducts } from '@/utils/cart';

const OrdersPage = () => {
  const { user: loggedInUser, cartMap } = useGlobalContext();
  const [syncedCart, setSyncedCart] = useState<ICartProduct[]>([]);

  useEffect(() => {
    if (!loggedInUser) return;

    const userCartMap: Map<string, ICartProduct> =
      cartMap.get(loggedInUser) || new Map();

    const products: IProduct[] = getStorageProducts();
    const updatedUserCartMap = new Map(userCartMap);
    let priceChanged = false;

    products.forEach((product) => {
      const cartItem = userCartMap.get(product.id);
      if (cartItem && cartItem.price !== product.price) {
        updatedUserCartMap.set(product.id, {
          ...cartItem,
          price: product.price,
        });
        priceChanged = true;
      }
    });

    if (priceChanged) {
      const updatedCartMap = new Map(cartMap);
      updatedCartMap.set(loggedInUser, updatedUserCartMap);

      const serializedCartMap = JSON.stringify(
        Array.from(updatedCartMap.entries()).map(([user, cart]) => [
          user,
          Array.from(cart.entries()),
        ])
      );
      localStorage.setItem('cartMap', serializedCartMap);
    }

    setSyncedCart(Array.from(updatedUserCartMap.values()));
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {syncedCart.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 2,
                    gap: 2,
                    backgroundColor: '#fff',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.title}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'contain',
                      borderRadius: 1,
                      backgroundColor: '#f5f5f5',
                    }}
                  />
                  <CardContent sx={{ flex: 1, padding: '0 !important' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                    <Typography variant="body2">Unit Price: ${item.price}</Typography>
                    <Typography variant="body2" fontWeight="bold" mt={1}>
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </AuthGuard>
  );
};

export default OrdersPage;
