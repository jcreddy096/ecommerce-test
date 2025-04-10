'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { Cart } from '@/app/types/cart';

interface CartCardProps {
  cart: Cart;
}

const CartCard = ({ cart }: CartCardProps) => {
  return (
    <Card sx={{ m: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6">Cart ID: {cart.id}</Typography>
        <Typography>Date: {cart.date}</Typography>
        <ul>
          {cart.products.map((product, i) => (
            <li key={i}>
              Product ID: {product.productId}, Qty: {product.quantity}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


export default  CartCard;