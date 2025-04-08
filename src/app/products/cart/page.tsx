
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
    const data = cartMap.get(user);
    return data instanceof Map ? data : new Map<string, ICartProduct>();
  }, [cartMap, user]);

  const cartItems = useMemo(() => {
    return Array.from(userCart.values()).filter((item) => item && item.id);
  }, [userCart]);

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    if (!user) return;

    const loadedProducts = getStorageProducts();
    setProducts(loadedProducts);

    const updates: UpdatedProductPair[] = [];
    const updatedCart = new Map(userCart); // clone

    for (const product of loadedProducts) {
      const cartItem = userCart.get(product.id);
      if (!cartItem) continue;

      const productPrice = Number(product.price) || 0;
      const cartPrice = Number(cartItem.price) || 0;

      if (productPrice !== cartPrice) {
        updates.push({
          old: cartItem,
          new: { ...product, price: productPrice },
        });
        updatedCart.set(product.id, { ...cartItem, price: productPrice });
      } else {
        updatedCart.set(product.id, cartItem);
      }
    }

    if (updates.length > 0) {
      const updatedCartMap = new Map(cartMap);
      updatedCartMap.set(user, updatedCart);
      handleCartMap(updatedCart);
      setPriceUpdates(updates);
      setShowPriceAlert(true);
    }
  }, [user, handleCartMap, userCart, cartMap]);

  const updateQuantity = (id: string, operation: 'increment' | 'decrement') => {
    const updatedCart = new Map(userCart);
    const item = updatedCart.get(id);
    const product = productMap.get(id);

    if (!item || !product) return;

    const currentQuantity = item.quantity;

    if (operation === 'increment') {
      if (currentQuantity >= product.stock) return;
      updatedCart.set(id, { ...item, quantity: currentQuantity + 1 });
    } else {
      updatedCart.set(id, { ...item, quantity: Math.max(1, currentQuantity - 1) });
    }

    const updatedCartMap = new Map(cartMap);
    updatedCartMap.set(user, updatedCart);
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
            disabled = {cartItems.length === 0}
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
                    product={productMap.get(item.id)}
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
