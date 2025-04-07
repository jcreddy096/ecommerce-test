
'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import { IProduct } from '@/types/product';
import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
} from '@mui/material';

type Props = {
  product: IProduct;
  isAdmin?: boolean;
};

const ProductCard = ({ product, isAdmin = false }: Props) => {
  const { id, title, price, image, stock } = product;
  const { cartMap, handleCartMap, user } = useGlobalContext();

  const userCart = cartMap[user] || {};
  const cartItem = userCart[id];
  const cartQuantity = cartItem?.quantity || 0;
  const availableStock = Math.max(0, stock - cartQuantity);
  const isDisabled = availableStock === 0;

  const handleAdd = () => {
    if (isDisabled) return;

    const updatedCart = { ...userCart };
    
    if (updatedCart[id]) {
      updatedCart[id].quantity += 1;
    } else {
      updatedCart[id] = { 
        id, 
        title, 
        price: Number(price),
        quantity: 1, 
        image 
      };
    }

    handleCartMap(updatedCart);
  };

  const handleRemove = () => {
    const updatedCart = { ...userCart };
    
    if (!updatedCart[id]) return;

    if (updatedCart[id].quantity > 1) {
      updatedCart[id].quantity -= 1;
    } else {
      delete updatedCart[id];
    }

    handleCartMap(updatedCart);
  };

  return (
    <Card sx={{ 
      width: 280, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <Box sx={{ 
        position: 'relative',
        paddingTop: '100%', 
        backgroundColor: 'grey.100'
      }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            objectFit: 'contain',
            p: 2
          }}
        />
        {isAdmin && (
          <Button
            component={Link}
            href={`/products/edit-product?id=${id}`}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'background.paper',
              minWidth: 'auto',
              padding: '4px 8px',
              borderRadius: '4px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Edit
          </Button>
        )}
      </Box>

      <CardContent sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={500} noWrap>
          {title}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            ${Number(price).toFixed(2)}
          </Typography>
          <Typography 
            variant="body2" 
            color={availableStock === 0 ? 'error.main' : 'text.secondary'}
          >
             stock: {availableStock} 
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
          {cartQuantity > 0 ? (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRemove}
                sx={{ 
                  minWidth: 32, 
                  px: 1,
                  borderColor: 'divider',
                  color: 'text.primary'
                }}
              >
                -
              </Button>
              <Typography sx={{ 
                px: 2, 
                display: 'flex', 
                alignItems: 'center'
              }}>
                {cartQuantity}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAdd}
                disabled={isDisabled}
                sx={{ 
                  minWidth: 32, 
                  px: 1,
                  borderColor: 'divider',
                  color: 'text.primary'
                }}
              >
                +
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={handleAdd}
              disabled={isDisabled}
              sx={{ 
                textTransform: 'none',
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': {
                  backgroundColor: 'action.disabled',
                  color: 'text.disabled'
                }
              }}
            >
              {isDisabled ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProductCard;