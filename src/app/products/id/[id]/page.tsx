import { fetchProductById } from '@/app/utils/productApi';
import ProductCard from '@/app/components/ProductCard';
import { Box } from '@mui/material';
import AuthGuard from '@/app/auth/AuthGuard';
import { JSX } from 'react';

export default async function ProductDetailPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  
  const id = Number(params.id);
  
  const product = await fetchProductById(id);

  return (
    <AuthGuard>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <ProductCard product={product} showActions fullWidth userId={0} />
      </Box>
    </AuthGuard>
  );
}
