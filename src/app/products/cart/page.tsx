
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import AuthGuard from '@/guards/AuthGuard';
import { ICartProduct, IProduct } from '@/types/product';
import { getStorageProducts } from '@/utils/cart';
import { Box, Typography, Button } from '@mui/material';
import CartPriceAlert from '@/components/CartPriceAlert';
import CartCard from '@/components/CartCard';

export type UpdatedProductPair = {
  old: ICartProduct;
  new: IProduct;
};

const CartPage = () => {
  const { user, cartMap, handleCartMap } = useGlobalContext();
  const router = useRouter();
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState<UpdatedProductPair[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const userCart = useMemo(() => {
    const data = cartMap[user];
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  }, [cartMap, user]);

  const cartItems = useMemo(
    () => Object.values(userCart).filter((item) => item && item.id),
    [userCart]
  );

  const productMap = useMemo(
    () =>
      products.reduce((map, product) => {
        map[product.id] = product;
        return map;
      }, {} as Record<string, IProduct>),
    [products]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const price = Number(item.price) || 0;
        return total + price * item.quantity;
      }, 0),
    [cartItems]
  );

  useEffect(() => {
    if (!user) return;

    const loadedProducts = getStorageProducts();
    setProducts(loadedProducts);

    const updates: UpdatedProductPair[] = [];
    const updatedCart = loadedProducts.reduce((acc, product) => {
      const cartItem = userCart[product.id];
      if (!cartItem) return acc;

      const productPrice = Number(product.price) || 0;
      const cartPrice = Number(cartItem.price) || 0;

      if (productPrice !== cartPrice) {
        updates.push({
          old: cartItem,
          new: { ...product, price: productPrice },
        });
        acc[product.id] = { ...cartItem, price: productPrice };
      } else {
        acc[product.id] = cartItem;
      }
      return acc;
    }, { ...userCart });

    if (updates.length > 0) {
      handleCartMap(updatedCart);
      setPriceUpdates(updates);
      setShowPriceAlert(true);
    }
  }, [user, handleCartMap, userCart]);

  const updateQuantity = (id: string, operation: 'increment' | 'decrement') => {
    const updatedCart = { ...userCart };
    if (!updatedCart[id]) return;

    const product = productMap[id];
    const currentQuantity = updatedCart[id].quantity;

    if (operation === 'increment') {
      if (product && currentQuantity >= product.stock) return;
      updatedCart[id].quantity += 1;
    } else {
      updatedCart[id].quantity = Math.max(1, currentQuantity - 1);
    }

    handleCartMap(updatedCart);
  };

  return (
    <AuthGuard>
      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4">Shopping Cart</Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/products/orders')}
          >
            Proceed to Orders
          </Button>
        </Box>

        {showPriceAlert && priceUpdates.length > 0 && (
          <CartPriceAlert
            priceUpdates={priceUpdates}
            onClose={() => setShowPriceAlert(false)}
          />
        )}

        {cartItems.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            {/* <Grid container spacing={3}>
              {cartItems.map((item) => (
                <Grid item xs={12} key={item.id.toString()}>
                  <CartCard
                    item={item}
                    product={productMap[item.id]}
                    updateQuantity={updateQuantity}
                  />
                </Grid>
              ))}
            </Grid> */}

<Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3, 
              }}
            >
              {cartItems.map((item) => (
                <Box key={item.id.toString()}>
                  <CartCard
                    item={item}
                    product={productMap[item.id]}
                    updateQuantity={updateQuantity}
                  />
                </Box>
              ))}
              </Box>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Typography variant="h5">
                Grand Total: ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </AuthGuard>
  );
};

export default CartPage;
