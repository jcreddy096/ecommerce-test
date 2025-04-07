'use client';

import React from 'react';
import { ICartProduct, IProduct } from '@/types/product';
import { Box, Card, CardMedia, Typography, Button } from '@mui/material';

type CartCardProps = {
  item: ICartProduct;
  product?: IProduct;
  updateQuantity: (id: string, operation: 'increment' | 'decrement') => void;
}

const CartCard = ({ item, product, updateQuantity }: CartCardProps) => {
  const availableStock = product ? product.stock - item.quantity : 0;
  const isOutOfStock = availableStock <= 0;

  return (
    <Card>
      <Box sx={{ display: 'flex', p: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 150, height: 150, objectFit: 'contain' }}
          image={item.image}
          alt={item.title}
        />
        <Box sx={{ flex: 1, ml: 3 }}>
          <Typography variant="h6">{item.title}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Price: ${Number(item.price || 0).toFixed(2)}
          </Typography>
          {product && (
            <Typography variant="body2" color="textSecondary">
              Available: {Math.max(0, product.stock - item.quantity)}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => updateQuantity(item.id.toString(), 'decrement')}
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
            <Button
              variant="outlined"
              onClick={() => updateQuantity(item.id.toString(), 'increment')}
              disabled={isOutOfStock}
            >
              +
            </Button>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Item Total: ${(item.quantity * Number(item.price || 0)).toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default CartCard;
