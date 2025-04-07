

'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import AuthGuard from '@/guards/AuthGuard';
import { IProduct } from '@/types/product';
import { useGlobalContext } from '@/context/GlobalContext';
import { isAdminEmail } from '@/utils/auth';

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { user } = useGlobalContext();
  const isAdmin = isAdminEmail(user);

  useEffect(() => {
   
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    }
  }, []);

  return (
    <AuthGuard>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          {isAdmin && (
            <Button
              component={Link}
              href="/products/add-product"
              variant="contained"
              size="medium"
              sx={{ textTransform: 'none' }}
            >
              Add Product
            </Button>
          )}
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
          justifyContent: 'center'
        }}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
              No products available
            </Typography>
          )}
        </Box>
      </Box>
    </AuthGuard>
  );
};

export default  ProductsPage;