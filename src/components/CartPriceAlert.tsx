'use client';

import React from 'react';
import { Alert, Typography } from '@mui/material';
import { UpdatedProductPair } from '@/app/products/cart/page';

type CartPriceAlertProps = {
  priceUpdates: UpdatedProductPair[];
  onClose: () => void;
}

const CartPriceAlert = ({ priceUpdates, onClose }:CartPriceAlertProps) => {
  return (
    <Alert severity="info" onClose={onClose} sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        Price updates:
      </Typography>
      {priceUpdates.map(({ old, new: updated }) => (
        <Typography variant="body2" key={old.id}>
          {old.title}: ${Number(old.price).toFixed(2)} → ${Number(updated.price).toFixed(2)}
        </Typography>
      ))}
    </Alert>
  );
};

export default CartPriceAlert;
