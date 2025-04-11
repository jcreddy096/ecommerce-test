import { fetchProductById } from '@/app/utils/productApi';
import ProductCard from '@/app/components/ProductCard';
import { Box } from '@mui/material';
import AuthGuard from '@/app/auth/AuthGuard';

interface PageProps {
  params: {
    id: string;
  };
}


const ProductDetailPage = async ({ params }: PageProps) => {
  const product = await fetchProductById(Number(params.id));

  
  return (
  
    <AuthGuard>
  <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
  
  <ProductCard product={product} showActions={true} fullWidth={true} userId={0} />;
  </Box>
  </AuthGuard>
  )
};

export default ProductDetailPage;
