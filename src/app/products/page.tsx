'use client';

import { useEffect, useState } from 'react';
import { Box,  Typography } from '@mui/material';
import { Product } from '@/app/types/product';
import ProductCard from '@/app/components/ProductCard';
import Pagination from '@/app/components/Pagination';
import { fetchAllProducts } from '@/app/utils/productApi';
import AuthGuard from '../auth/AuthGuard';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <AuthGuard>
    <Box p={4}>
      <Typography variant="h4" mb={4} textAlign="center">Products</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          loading... 
        </Box>
      ) : (
        <>
          
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
              {paginatedProducts.map((product) => (
                <Box key={product.id} width={{ xs: '100%', sm: '45%', md: '30%' }}>
                  <ProductCard product={product} userId={0} />
                </Box>
              ))}
            </Box>

          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </Box>
        </>
      )}
    </Box>
    </AuthGuard>
  );
  
};

export default ProductsPage;
