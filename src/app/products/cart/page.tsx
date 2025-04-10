
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Cart } from '@/app/types/cart';
import { fetchCartsByCartId } from '@/app/utils/cartApi';
import CartCard from '@/app/components/CartCard';
import { Box } from '@mui/material';
import AuthGuard from '@/app/auth/AuthGuard';

const CartPage = () => {
  const { user } = useAuth();
  const [userCarts, setUserCarts] = useState<Cart[]>([]);

  useEffect(() => {
    const getCarts = async () => {
      if (user?.id) {
        const carts = await fetchCartsByCartId(user.id);
        setUserCarts(carts);
      }
    };

    getCarts();
  }, [user]);

  return (
    <AuthGuard>
    <Box>
      <h2>Your Cart Orders</h2>
      {userCarts.map((cart) => (
        <CartCard key={cart.id} cart={cart} />
      ))}
    </Box>
    </AuthGuard>
  );
};
export default  CartPage;

